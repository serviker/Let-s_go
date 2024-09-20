<?php

namespace App\Http\Controllers\Order;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\Order;
use App\Models\Passenger;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class ShowController extends Controller
{
    public function __invoke(Request $request,Order $order)
    {
        // Получаем текущего аутентифицированного пользователя
        $user = Auth::user();

        // Извлекаем критерии поиска из сессии
        $sessionCriteria = session('searchCriteria', []);

        // Получаем критерии из запроса Извлекаем конкретные параметры
        $departureCity = $sessionCriteria['departureCity'] ?? null;
        $arrivalCity = $sessionCriteria['arrivalCity'] ?? null;
        $seats = $sessionCriteria['seats'] ?? null;

       // Log::info('Логируем $sessionCriteria полученные критерии in Order/ShowController:', $sessionCriteria);

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

        $passengers = $order->passengers->map(function ($passenger) {
            return [
                'id' => $passenger->id,
                'name' => $passenger->name,
                'photoUrl' => $passenger->photoUrl ? asset('/' . $passenger->photoUrl) : null,
                'departureCity' => $passenger->pivot->departure_city ?? 'Unknown',
                'arrivalCity' => $passenger->pivot->arrival_city ?? 'Unknown',
                'seats' => $passenger->pivot->seats // Добавляем количество забронированных мест
            ];
        });


        // Проверяем, является ли пользователь пассажиром в заказе
        $isBooked = $order->passengers()->where('passenger_id', $user->id)->exists();

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
            'passengers' => $passengers,
            'isBooked' => $isBooked,
            'searchCriteria' => $sessionCriteria, // Передаем критерии поиска в компонент
        ];

        // Проверяем, является ли пользователь водителем в этом заказе
        if ($user && $user->id === $order->driver_id) {
            return Inertia::render('Orders/DriverOrderDetails', [
                'order' => $data,
                'canJoin' => false,// Водитель не может присоединиться к поездке
                'searchCriteria' => [
                    'departureCity' => $departureCity,
                    'arrivalCity' => $arrivalCity,
                    'seats' => $seats
                ]
            ]);
        }

        // Для пользователей, которые не являются водителем или пассажиром, показываем данные и возможность присоединиться
        return Inertia::render('Orders/PassengerOrderDetails', [
            'order' => $data,
            'canJoin' => !$isBooked,//true,  Пользователь может присоединиться к поездке
            'searchCriteria' => [
                'departureCity' => $departureCity,
                'arrivalCity' => $arrivalCity,
                'seats' => $seats
            ]
        ]);
    }
    public function joinOrder(Request $request, $orderId)
    {
        $user = Auth::user();
        $sessionCriteria = session('searchCriteria', []);
        if (!$user) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        $order = Order::find($orderId);

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        if ($order->available_seats <= 0) {
            return response()->json(['message' => 'No available seats'], 400);
        }

        // Получаем данные из критериев
        $departureCity = $sessionCriteria['departureCity'] ?? null;
        $arrivalCity = $sessionCriteria['arrivalCity'] ?? null;
        $seats = $sessionCriteria['seats'] ?? 1; // Количество мест по умолчанию — 1

        // Проверяем, свободны ли заявленные места
        if ($order->available_seats < $seats) {
            return back()->withErrors('Недостаточно свободных мест для бронирования.');
        }

        // Проверяем, что пользователь не является пассажиром в этом заказе
        $exists = DB::table('order_passenger')
            ->where('order_id', $orderId)
            ->where('passenger_id', $user->id)
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'Passenger already assigned to this order'], 400);
        }

        // Добавляем пользователя в список пассажиров
        $order->passengers()->attach($user->id, [
            'seats' => $seats,
            'departure_city' => $departureCity,
            'arrival_city' => $arrivalCity
        ]);

        $order->available_seats -= $seats;
        $order->save();

        return redirect()->route('order.show', ['order' => $orderId]);
    }

    public function cancelOrderPassenger(Request $request, $orderId)
    {
        $user = Auth::user();

        // Проверяем, авторизован ли пользователь
        if (!$user) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        $order = Order::find($orderId);

        // Проверяем, существует ли заказ
        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        // Проверяем, является ли пользователь пассажиром в этом заказе
        $passenger = DB::table('order_passenger')
            ->where('order_id', $orderId)
            ->where('passenger_id', $user->id)
            ->first();

        if (!$passenger) {
            return response()->json(['message' => 'Passenger not found in this order'], 400);
        }

        // Увеличиваем количество свободных мест
        $order->available_seats += $passenger->seats;
        $order->save();

        // Удаляем пассажира из таблицы order_passenger
        $order->passengers()->detach($user->id);

        // Возвращаем Inertia-ответ
       /* try {
            return Inertia::render('Orders/PassengerOrderDetails', [
                'order' => $order,
            ]);
        } catch (Exception $e) {
            dd($e->getMessage());
        }*/

        return redirect()->route('order.show', ['order' => $orderId]);
    }

    public function cancelOrderDriver(Request $request, $orderId)
    {
        $user = Auth::user();

        // Проверяем, авторизован ли пользователь
        if (!$user) {
            return redirect()->back()->with('error', 'User not authenticated');
        }

        // Получаем заказ
        $order = Order::find($orderId);

        // Проверяем, существует ли заказ
        if (!$order) {
            return redirect()->back()->with('error', 'Order not found');
        }

        // Проверяем, является ли пользователь водителем данного заказа
        if ($order->driver_id !== $user->id) {
            return redirect()->back()->with('error', 'You are not the driver of this order');
        }

        // Уведомляем пассажиров о том, что поездка отменена
        $passengers = $order->passengers;
        foreach ($passengers as $passenger) {
            // Здесь можно отправить уведомление пассажирам
            // Например, используя событие или e-mail уведомление
        }

        // Удаляем заказ
        $order->passengers()->detach(); // Убираем всех пассажиров из заказа
        $order->delete(); // Удаляем сам заказ

        // Перенаправляем пользователя с подтверждением отмены
        return redirect()->route('driver.orders');//->with('success', 'Trip has been successfully canceled');
    }

}
