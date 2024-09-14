<?php

namespace App\Http\Controllers\Order;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\Order;
use App\Models\Passenger;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ShowController extends Controller
{
    public function __invoke(Request $request,Order $order)
    {
        // Получаем текущего аутентифицированного пользователя
        $user = Auth::user();

        // Получаем переданные города из запроса
        $searchCriteria = $request->only(['departureCity', 'arrivalCity']);

        // Логируем полученные критерии
        Log::info('Логируем полученные критерии in ShowController:', $searchCriteria);


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

        // Получаем пассажиров с их городами отправления и прибытия
//        $passengers = $order->passengers()->get()->map(function ($passenger) use ($order) {
//            $pivotData = $passenger->pivot; // Данные из pivot таблицы
//            return [
//                'id' => $passenger->id,
//                'name' => $passenger->name,
//                'photoUrl' => $passenger->photoUrl ? asset('/' . $passenger->photoUrl) : null,
//                'departureCity' => $pivotData->departure_city ?? 'Unknown', // Город отправления пассажира
//                'arrivalCity' => $pivotData->arrival_city ?? 'Unknown',     // Город прибытия пассажира
//            ];
//        });

        // Получаем пассажиров с их городами отправления и прибытия
        $passengers = $order->passengers()->withPivot('departure_city', 'arrival_city')->get()->map(function ($passenger) {
            $pivotData = $passenger->pivot;
            return [
                'id' => $passenger->id,
                'name' => $passenger->name,
                'photoUrl' => $passenger->photoUrl ? asset('/' . $passenger->photoUrl) : null,
                'departureCity' => $pivotData->departure_city ?? 'Unknown',
                'arrivalCity' => $pivotData->arrival_city ?? 'Unknown',
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
            'passengers' => $passengers, // Добавляем информацию о пассажирах
            'isBooked' => $isBooked, // Передаем это значение на клиент
//            'departureCity' => $departureCity ?? 'Unknown',
//            'arrivalCity' => $arrivalCity ?? 'Unknown',
        ];

        // Проверяем, является ли пользователь водителем в этом заказе
        if ($user && $user->id === $order->driver_id) {
            return Inertia::render('Orders/DriverOrderDetails', [
                'order' => $data,
                'canJoin' => false, // Водитель не может присоединиться к поездке
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
        $user = Auth::user();

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

        // Получаем города отправления и прибытия из запроса
        $departureCity = $request->input('departure_city');
        $arrivalCity = $request->input('arrival_city');

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
            'departure_city' => $departureCity,
            'arrival_city' => $arrivalCity,
        ]);

        $order->available_seats--;
        $order->save();

        // Возвращаем Inertia ответ с данными заказа
        return Inertia::render('Orders/PassengerOrderDetails', [
            'order' => $order
        ]);
    }
}
