<?php

namespace App\Http\Controllers\Order;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class IndexController extends Controller
{
    public function __invoke()
    {
        $user = Auth::user(); // Получаем текущего аутентифицированного пользователя

        if (!$user) {
            return Inertia::render('order.index', [
                'orders' => [],
            ]);
        }

        // Получаем заказы, созданные текущим пользователем
        $orders = Order::with(['fromAddress', 'toAddress'])
            ->where('user_id', $user->id)
            ->get();

        return Inertia::render('order.index', [
            'orders' => $orders,
        ]);
    }

    // Метод для отображения всех поездок водителя
    public function driverOrders()
    {
        $driver = Auth::user(); // Получаем текущего аутентифицированного пользователя

        if (!$driver) {
            return Inertia::render('Orders/DriverOrders', [
                'orders' => [],
            ]);
        }

        // Получаем заказы, где текущий пользователь является водителем
        $orders = Order::with(['fromAddress', 'toAddress', 'driver'])
            ->where('driver_id', $driver->id)
            ->get()
            ->map(function ($order) {
                $fromAddress = $order->fromAddress;
                $toAddress = $order->toAddress;
                $driver = $order->driver; // Получаем водителя из заказа
                $car = $driver ? $driver->cars->first() : null; // Получаем первую машину водителя

                return [
                    'id' => $order->id,
                    'fromCity' => $fromAddress->city ?? 'Unknown',
                    'toCity' => $toAddress->city ?? 'Unknown',
                    'price' => (string) $order->price, // Преобразуем в строку
                    'driverName' => $driver ? $driver->name : 'Unknown',
                    'carName' => $car ? ($car->brand . ' ' . $car->model) : 'No car',
                    'dateTimeDeparture' => $order->date_time_departure ?? 'Unknown',
                    'driverPhotoUrl' => $driver && $driver->photoUrl ? asset('/' . $driver->photoUrl) : null,
                ];
            });

        return Inertia::render('Orders/DriverOrders', [
            'orders' => $orders,
        ]);
    }

    public function passengerOrders(Request $request)
    {
        $user = Auth::user(); // Получаем текущего аутентифицированного пользователя

        // Валидация входящих данных
        $validated = $request->validate([
            'departureCity' => 'required|string',
            'arrivalCity' => 'required|string',
            'date' => 'required|date',
            'seats' => 'required|integer|min:1',
        ]);

        if (!$user) {
            return response()->json([
                'orders' => [],
                'message' => 'User not authenticated'
            ], 401);
        }

        // Получаем данные из запроса
        $searchCriteria = $request->only(['departureCity', 'arrivalCity', 'date', 'seats']);
        Log::info('IndexController Search Criteria:', $searchCriteria); // Логируем критерии поиска

        // Сохраняем критерии поиска в сессию
        session([
            'searchCriteria' => $searchCriteria
        ]);

        // Сохраняем критерии поиска в сессию для последующего использования
        session()->put('searchCriteria', $searchCriteria);

        // Получаем заказы на основе критериев поиска
        $ordersQuery = Order::with(['fromAddress', 'toAddress', 'intermediateAddresses', 'driver'])
            ->whereDate('date_time_departure', $searchCriteria['date'])
            ->where('available_seats', '>=', $searchCriteria['seats'])
            ->where(function ($query) use ($searchCriteria) {
                $query->whereHas('fromAddress', function ($query) use ($searchCriteria) {
                    $query->where('city', $searchCriteria['departureCity']);
                })
                    ->whereHas('toAddress', function ($query) use ($searchCriteria) {
                        $query->where('city', $searchCriteria['arrivalCity']);
                    })
                    ->orWhereHas('intermediateAddresses', function ($query) use ($searchCriteria) {
                        $query->where('city', $searchCriteria['departureCity'])
                            ->orWhere('city', $searchCriteria['arrivalCity']);
                    });
            });


        // Логируем SQL запрос для отладки
       /* Log::info('IndexController Generated SQL Query:', ['query' => $ordersQuery->toSql()]);

        $orders = $ordersQuery->get()->map(function ($order) {
            $fromAddress = $order->fromAddress;
            $toAddress = $order->toAddress;
            $driver = $order->driver;
            $car = $driver ? $driver->cars->first() : null; // Получаем первую машину водителя

            // Логируем информацию по каждому заказу
            Log::info('IndexController Order:', [
                'id' => $order->id,
                'fromCity' => $fromAddress->city ?? 'Unknown',
                'toCity' => $toAddress->city ?? 'Unknown',
                'price' => (string) $order->price,
                'driverName' => $driver->name ?? 'Unknown',
                'carName' => $car ? ($car->brand . ' ' . $car->model) : 'No car',
                'dateTimeDeparture' => $order->date_time_departure ?? 'Unknown',
                'driverPhotoUrl' => $driver->photoUrl ? asset('/' . $driver->photoUrl) : null,
            ]);

            return [
                'id' => $order->id,
                'fromCity' => $fromAddress->city ?? 'Unknown',
                'toCity' => $toAddress->city ?? 'Unknown',
                'price' => (string) $order->price,
                'driverName' => $driver->name ?? 'Unknown',
                'carName' => $car ? ($car->brand . ' ' . $car->model) : 'No car',
                'dateTimeDeparture' => $order->date_time_departure ?? 'Unknown',
                'driverPhotoUrl' => $driver->photoUrl ? asset('/' . $driver->photoUrl) : null,
            ];
        }); */

        $orders = $ordersQuery->get();
        Log::info('IndexController/Orders:', $orders->toArray());
        // Перебор всех заказов и генерация URL для каждого
        $ordersWithUrls = $orders->map(function ($order) use ($searchCriteria) {
            return [
                'id' => $order->id,
                'fromCity' => $order->fromAddress->city ?? 'Unknown',
                'toCity' => $order->toAddress->city ?? 'Unknown',
                'price' => (string) $order->price,
                'driverName' => $order->driver->name ?? 'Unknown',
                'carName' => $order->driver->cars->first() ? ($order->driver->cars->first()->brand . ' ' . $order->driver->cars->first()->model) : 'No car',
                'dateTimeDeparture' => $order->date_time_departure ?? 'Unknown',
                'driverPhotoUrl' => $order->driver->photoUrl ? asset('/' . $order->driver->photoUrl) : null,
                // Генерация URL для каждого заказа
                'url' => route('order.show', [
                    'order' => $order->id,
                    'departureCity' => $searchCriteria['departureCity'],
                    'arrivalCity' => $searchCriteria['arrivalCity'],
                    'seats' => $searchCriteria['seats']
                ])
            ];
        });

        // Логируем финальный массив с URL
       // Log::info('IndexController Логируем финальный массив с URLs:', ['ordersWithUrls' => $ordersWithUrls->toArray()]);
        Log::info('Orders/IndexController with URLs:', $ordersWithUrls->toArray());
        // Логируем конечный массив заказов перед отправкой на фронт
       // Log::info('IndexController Final Orders Array:', ['orders' => $orders->toArray()]);

        // Логика для получения первого найденного заказа
        /* $order = $orders->first(); // Пример: берем первый заказ для демонстрации

         // Передача параметров в URL для ShowController
     /*  if ($order) {
             // Генерируем URL с параметрами городов
             $url = route('order.show', [
                 'order' => $order->id,
                 'departureCity' => $searchCriteria['departureCity'],
                 'arrivalCity' => $searchCriteria['arrivalCity']
             ]);

             // Редирект на этот URL
             return redirect($url);
         }*/


       /*  return Inertia::render('Orders/PassengerOrders', [
            'orders' => $orders,
        ]);*/

       // return response()->json(['orders' => $orders->toArray(),]);
        return response()->json(['orders' => $ordersWithUrls->toArray(),
            // Возвращаем последние критерии поиска
            'SearchCriteria' => session('searchCriteria')
            ]);
    }
}

