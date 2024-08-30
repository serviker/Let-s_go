<?php

namespace App\Http\Controllers\Order;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class IndexController extends Controller
{
    public function __invoke()
    {
        $user = Auth::user(); // Получаем текущего аутентифицированного пользователя

        if (!$user) {
            return Inertia::render('Orders/PassengerOrders', [
                'orders' => [],
            ]);
        }

        // Получаем заказы, созданные текущим пользователем
        $orders = Order::with(['fromAddress', 'toAddress'])
            ->where('user_id', $user->id)
            ->get();

        return Inertia::render('Orders/PassengerOrders', [
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

        // Дебаг данных запроса
        // Log::info('Search Criteria', $searchCriteria);

        $orders = Order::with(['fromAddress', 'toAddress', 'intermediateAddresses', 'driver'])
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
            })
            ->get()
            ->map(function ($order) {
                $fromAddress = $order->fromAddress;
                $toAddress = $order->toAddress;
                $driver = $order->driver;
                $car = $driver->cars->first();

                return [
                    'id' => $order->id,
                    'fromCity' => $fromAddress->city ?? 'Unknown',
                    'toCity' => $toAddress->city ?? 'Unknown',
                    'price' => (string) $order->price, // Преобразуем в строку
                    'driverName' => $driver->name ?? 'Unknown',
                    'carName' => $car ? ($car->brand . ' ' . $car->model) : 'No car',
                    'dateTimeDeparture' => $order->date_time_departure ?? 'Unknown',
                    'driverPhotoUrl' => $driver->photoUrl ? asset('/' . $driver->photoUrl) : null,
                ];
            });

        /*return Inertia::render('Orders/PassengerOrders', [
            'orders' => $orders,
        ]);*/
        return Inertia::render('Welcome', [
            $user = Auth::user(),
            'auth' => [
                'user' => $user,
            ],
            'orders' => $orders,
            'laravelVersion' => app()->version(),
            'phpVersion' => PHP_VERSION,
        ]);
    }
}

