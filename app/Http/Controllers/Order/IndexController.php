<?php

namespace App\Http\Controllers\Order;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\Car;
use App\Models\Driver;
use App\Models\Order;
use App\Models\User;
use Carbon\Carbon;
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
        // Получаем текущего аутентифицированного пользователя
        $user = Auth::user();

        if (!$user) {
            return Inertia::render('Orders/DriverOrders', [
                'orders' => [],
            ]);
        }

        // Находим водителя по user_id в модели Driver
        $driver = Driver::where('user_id', $user->id)->first();

        if (!$driver) {
            return Inertia::render('Orders/DriverOrders', [
                'orders' => [],
            ]);
        }

        // Получаем заказы, где текущий пользователь является водителем
        $orders = Order::with(['fromAddress', 'toAddress', 'driver'])
            ->where('driver_id', $driver->id)
            ->get()
            ->map(function ($order) use ($user) {
                $fromAddress = $order->fromAddress;
                $toAddress = $order->toAddress;
                $car = Car::where('user_id', $user->id)->first(); // Извлечение автомобиля аутентифицированного пользователя

                return [
                    'id' => $order->id,
                    'fromCity' => $fromAddress->city ?? 'Unknown',
                    'toCity' => $toAddress->city ?? 'Unknown',
                    'price' => (string) $order->price,
                    'driverName' => $user->name, // Имя водителя из аутентифицированного пользователя
                    'carName' => $car ? ($car->brand . ' ' . $car->model) : 'No car',
                    'dateTimeDeparture' => $order->date_time_departure ?? 'Unknown',
                    'driverPhotoUrl' => $user->photoUrl ? asset('/' . $user->photoUrl) : null,
                    'status_order_id' => $order->status_order_id,
                ];
            });

        Log::info('IndexController/driverOrders: Driver Orders', $orders->toArray());

        return Inertia::render('Orders/DriverOrders', [
            'orders' => $orders,
        ]);
    }

    // рабочий метод
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

        // Сохраняем критерии поиска в сессию для последующего использования
        session()->put('searchCriteria', $searchCriteria);

        // Получаем текущую дату и время
        $now = Carbon::now();

        // Получаем заказы на основе критериев поиска
        $ordersQuery = Order::with(['fromAddress', 'toAddress', 'intermediateAddresses', 'driver'])
            ->whereDate('date_time_departure', $searchCriteria['date'])
            ->where('available_seats', '>=', $searchCriteria['seats'])
            ->where('date_time_departure', '>', $now) // Фильтрация по актуальному времени
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
//                   ->whereDoesntHave('intermediateAddresses', function ($query) use ($searchCriteria) {
//                       // Убедимся, что промежуточные адреса не содержат неправильные города
//                       $query->where('city', '!=', $searchCriteria['departureCity'])
//                           ->where('city', '!=', $searchCriteria['arrivalCity']);
//                   });
            });

        $orders = $ordersQuery->get();

        Log::info('IndexController/passengerOrders:', $orders->toArray());

        // Перебор всех заказов и генерация URL для каждого
        $ordersWithUrls = $orders->map(function ($order) use ($searchCriteria) {
            $driver = $order->driver; // Получаем водителя

            return [
                'id' => $order->id,
                'fromCity' => $order->fromAddress->city ?? 'Unknown',
                'toCity' => $order->toAddress->city ?? 'Unknown',
                'price' => (string) $order->price,
                'driverName' => $driver ? $driver->name : 'Unknown', // Проверяем, есть ли водитель
                'carName' => $driver && $driver->cars->first() ? ($driver->cars->first()->brand . ' ' . $driver->cars->first()->model) : 'No car',
                'dateTimeDeparture' => $order->date_time_departure ?? 'Unknown',
                'driverPhotoUrl' => $driver && $driver->photoUrl ? asset('/' . $driver->photoUrl) : null, // Проверяем, есть ли водитель
                'status_order_id' => $order->status_order_id,
                // Генерация URL для каждого заказа
                'url' => route('order.show', [
                    'order' => $order->id,
                    'departureCity' => $searchCriteria['departureCity'],
                    'arrivalCity' => $searchCriteria['arrivalCity'],
                    'seats' => $searchCriteria['seats']
                ])
            ];
        });

        Log::info('IndexController/passengerOrders.$ordersWithUrls:', $ordersWithUrls->toArray());

        // Если заказы найдены, сохраняем их в сессии
        session()->put('foundOrders', $ordersWithUrls);

        return response()->json([
            'orders' => $ordersWithUrls->toArray(),
            // Возвращаем последние критерии поиска
            'searchCriteria' => session('searchCriteria')
        ]);
    }


  /*  public function passengerOrders(Request $request)
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

        // Сохраняем критерии поиска в сессию для последующего использования
        session()->put('searchCriteria', $searchCriteria);

        // Получаем текущую дату и время
        $now = Carbon::now();

        // Получаем заказы на основе критериев поиска
        // Получаем заказы на основе критериев поиска
        $ordersQuery = Order::with(['fromAddress', 'toAddress', 'intermediateAddresses', 'driver'])
            ->whereDate('date_time_departure', $searchCriteria['date'])
            ->where('available_seats', '>=', $searchCriteria['seats'])
            ->where('date_time_departure', '>', $now) // Фильтрация по актуальному времени
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

        $orders = $ordersQuery->get();

        // Формирование ответа
        // Перебор всех заказов и генерация URL для каждого
        $ordersWithUrls = $orders->map(function ($order) use ($searchCriteria) {
            $driver = $order->driver; // Получаем водителя

            return [
                'id' => $order->id,
                'fromCity' => $order->fromAddress->city ?? 'Unknown',
                'toCity' => $order->toAddress->city ?? 'Unknown',
                'price' => (string) $order->price,
                'driverName' => $driver ? $driver->name : 'Unknown', // Проверяем, есть ли водитель
                'carName' => $driver && $driver->cars->first() ? ($driver->cars->first()->brand . ' ' . $driver->cars->first()->model) : 'No car',
                'dateTimeDeparture' => $order->date_time_departure ?? 'Unknown',
                'driverPhotoUrl' => $driver && $driver->photoUrl ? asset('/' . $driver->photoUrl) : null, // Проверяем, есть ли водитель
                'status_order_id' => $order->status_order_id,
                // Генерация URL для каждого заказа
                'url' => route('order.show', [
                    'order' => $order->id,
                    'departureCity' => $searchCriteria['departureCity'],
                    'arrivalCity' => $searchCriteria['arrivalCity'],
                    'seats' => $searchCriteria['seats']
                ])
            ];
        });
        Log::info('IndexController/passengerOrders.$ordersWithUrls:', $ordersWithUrls->toArray());

        // Если заказы найдены, сохраняем их в сессии
        session()->put('foundOrders', $ordersWithUrls);

        return response()->json([
            'orders' => $ordersWithUrls->toArray(),
            // Возвращаем последние критерии поиска
            'searchCriteria' => session('searchCriteria')
        ]);
    }*/



    public function ordersPassenger()
    {
        $passenger = Auth::user(); // Получаем текущего аутентифицированного пользователя

        if (!$passenger) {
            return Inertia::render('Orders/PassengerOrders', [
                'orders' => [],
            ]);
        }

        // Получаем заказы, где текущий пользователь является пассажиром
        $orders = Order::with(['fromAddress', 'toAddress', 'driver'])
            ->whereHas('passengers', function ($query) use ($passenger) {
                $query->where('passenger_id', $passenger->id);
            })
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

        return Inertia::render('Orders/PassengerTripsOrders', [
            'orders' => $orders,
        ]);
    }

}

