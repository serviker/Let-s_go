<?php

namespace App\Http\Controllers\Order;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ShowController extends Controller
{
    public function __invoke(Order $order)
    {
        // Получаем текущего аутентифицированного пользователя
        $user = Auth::user();

        // Получаем связанные адреса
        $fromAddress = $order->fromAddress;
        $toAddress = $order->toAddress;

        // Получаем промежуточные адреса, связанные с заказом
        $intermediateAddresses = $order->intermediateAddresses()->pluck('city')->toArray();

        // Получаем объект пользователя (водителя) через driver_id
        $driver = User::with('cars')->find($order->driver_id);
        $car = $driver ? $driver->cars->first() : null;

        // Преобразуем цену в число с плавающей запятой
        $price = (float) $order->price;

        // Собираем данные для передачи в компонент
        $data = [
            'id' => $order->id,
            'departureAddress' => $fromAddress->street . ' ' . $fromAddress->house ?? 'Unknown',
            'arrivalAddress' => $toAddress->street . ' ' . $toAddress->house ?? 'Unknown',
            'fromCity' => $fromAddress->city ?? 'Unknown',
            'toCity' => $toAddress->city ?? 'Unknown',
            'intermediate_addresses' => $intermediateAddresses,
            'price' => $price,
            'driverName' => $driver ? $driver->name : 'Unknown',
            'carName' => $car ? ($car->brand . ' ' . $car->model) : 'No car',
            'carColor' => $car ? $car->color : 'No car',
            'carPhoto' => $car && $car->photoUrl ? asset('/' . $car->photoUrl) : null,
            'dateTimeDeparture' => $order->date_time_departure ?? 'Unknown',
            'driverPhotoUrl' => $driver && $driver->photoUrl ? asset('/' . $driver->photoUrl) : null,
            'driverId' => $driver ? $driver->id : 0,
            'description' => $order->description ?? 'No description provided',
            'availableSeats' => $order->available_seats ?? 'Нет свободных мест',
        ];

        // Проверяем, является ли пользователь водителем в этом заказе
        if ($user && $user->id === $order->driver_id) {
            return Inertia::render('Orders/DriverOrderDetails', [
                'order' => $data,
                'canJoin' => false, // Водитель не может присоединиться к поездке
            ]);
        }

        // Проверяем, является ли пользователь пассажиром в этом заказе
        if ($user && $user->id === $order->passenger_id) {
            return Inertia::render('Orders/PassengerOrderDetails', [
                'order' => $data,
                'canJoin' => false, // Пассажир не может присоединиться к поездке
            ]);
        }

        // Для пользователей, которые не являются водителем или пассажиром, показываем данные и возможность присоединиться
        return Inertia::render('Orders/PassengerOrderDetails', [
            'order' => $data,
            'canJoin' => false,//true,  Пользователь может присоединиться к поездке
        ]);
    }

    public function joinOrder(Request $request, $orderId)
    {
        $user = Auth::user(); // Получаем текущего пользователя

        if (!$user) {
            return response()->json([
                'message' => 'User not authenticated',
            ], 401);
        }

        // Находим заказ по ID
        $order = Order::find($orderId);

        if (!$order) {
            return response()->json([
                'message' => 'Order not found',
            ], 404);
        }

        // Проверяем, свободны ли места
        if ($order->available_seats <= 0) {
            return response()->json([
                'message' => 'No available seats',
            ], 400);
        }

        // Проверяем, что пользователь уже не является пассажиром в этом заказе
        if ($order->passenger_id) {
            return response()->json([
                'message' => 'Passenger already assigned to this order',
            ], 400);
        }

        // Добавляем пользователя как пассажира
        if (!$user->passenger) {
            // Создаем запись пассажира, если он еще не зарегистрирован как пассажир
            $user->passenger()->create([
                'user_id' => $user->id,
            ]);
        }

        // Обновляем заказ, добавляя passenger_id
        $order->passenger_id = $user->passenger->id;
        $order->available_seats--; // Уменьшаем количество свободных мест
        $order->save(); // Сохраняем изменения

        return response()->json([
            'message' => 'Passenger added to order successfully',
            'order' => $order,
        ]);
    }
}
