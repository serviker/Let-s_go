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
        // Получаем данные из запроса
        $searchCriteria = $request->only(['departureCity', 'arrivalCity', 'date', 'seats']);
        Log::info('Search Criteria:', $searchCriteria); // Логируем критерии поиска

        // Проверяем наличие и значение ключей
      /*  $departureCity = $searchCriteria['departureCity'] ?? null;
        $arrivalCity = $searchCriteria['arrivalCity'] ?? null;
        $date = $searchCriteria['date'] ?? now()->format('Y-m-d');
        $seats = $searchCriteria['seats'] ?? 1;

        if (!isset($departureCity) || !isset($arrivalCity)) {
            return response()->json(['error' => 'Departure city and arrival city are required'], 400);
        }
*/

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
        Log::info('Generated SQL Query:', ['query' => $ordersQuery->toSql()]);

        $orders = $ordersQuery->get()->map(function ($order) {
            $fromAddress = $order->fromAddress;
            $toAddress = $order->toAddress;
            $driver = $order->driver;
            $car = $driver ? $driver->cars->first() : null; // Получаем первую машину водителя

            // Логируем информацию по каждому заказу
            Log::info('Order:', [
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
        });

        // Логируем конечный массив заказов перед отправкой на фронт
        Log::info('Final Orders Array:', ['orders' => $orders->toArray()]);


       /*  return Inertia::render('Orders/PassengerOrders', [
            'orders' => $orders,
        ])*/

        return response()->json([
            'orders' => $orders->toArray(),
        ]);
/*
        return response()->json([
            'orders' => [
                [
                    'id' => 1,
                    'fromCity' => 'Москва',
                    'toCity' => 'Санкт-Петербург',
                    'price' => '1000.00',
                    'driverName' => 'Иван',
                    'carName' => 'Lada Vesta',
                    'dateTimeDeparture' => '2024-09-01 08:00:00',
                    'driverPhotoUrl' => 'http://localhost:8000/images/image1.png'
                ],
                [
                    'id' => 2,
                    'fromCity' => 'Казань',
                    'toCity' => 'Нижний Новгород',
                    'price' => '800.00',
                    'driverName' => 'Алексей',
                    'carName' => 'Renault Logan',
                    'dateTimeDeparture' => '2024-09-01 09:00:00',
                    'driverPhotoUrl' => 'http://localhost:8000/images/image2.png'
                ],
            ]
        ]);*/

    }
}

