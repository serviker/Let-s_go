<?php

namespace App\Http\Controllers\Order;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ShowController extends Controller
{
    public function __invoke(Order $order)
    {
        // Получаем связанные адреса
        $fromAddress = $order->fromAddress;
        $toAddress = $order->toAddress;

        // Получаем промежуточные адреса, связанные с заказом
        $intermediateAddresses = $order->intermediateAddresses()->pluck('city')->toArray();

        // Получаем объект пользователя (водителя) через driver_id
        $driver = User::with('cars')->find($order->driver_id);
        $car = $driver->cars->first();

        // Преобразуем цену в число с плавающей запятой
        $price = (float) $order->price;

        // Собираем данные для передачи в компонент
        $data = [
            'departureAddress' => $fromAddress->street . ' ' . $fromAddress->house ?? 'Unknown',
            'arrivalAddress' => $toAddress->street . ' ' . $toAddress->house ?? 'Unknown',
            'fromCity' => $fromAddress->city ?? 'Unknown',
            'toCity' => $toAddress->city ?? 'Unknown',
            'intermediate_addresses' => $intermediateAddresses,  // Промежуточные города
            'price' => $price,
            'driverName' => $driver->name ?? 'Unknown',
            'carName' => $car ? ($car->brand . ' ' . $car->model) : 'No car',
            'carColor' => $car ? ($car->color) : 'No car',
            'dateTimeDeparture' => $order->date_time_departure ?? 'Unknown',
            'driverPhotoUrl' => $driver && $driver->photoUrl ? asset('/' . $driver->photoUrl) : null,
            'driverId' => $driver->id ?? 0,  // Добавляем ID водителя
            'description' => $order->description ?? 'No description provided',  // Добавляем описание
            'availableSeats' => $order->available_seats ?? 'Нет свободных мест',  // Добавляем количество доступных мест
        ];

        return Inertia::render('Orders/DriverOrderDetails', [
            'order' => $data,
        ]);
    }
}
