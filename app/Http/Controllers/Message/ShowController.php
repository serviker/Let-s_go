<?php

namespace App\Http\Controllers\Message;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\Message;
use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ShowController extends Controller
{
    public function __invoke($orderId, $userId = null) {
        // Получить заказ с пассажирами и водителем
        $order = Order::with(['passengers', 'driver'])->findOrFail($orderId);

        // Текущий пользователь
        $currentUser = auth()->user();

        // Определяем, кто является пассажиром и водителем
        $passenger = $userId ? User::findOrFail($userId) : $currentUser;
        $driver = $order->driver;

        // Получаем сообщения между пассажиром и водителем
        $messages = $this->getMessagesBetweenUsers($order, $passenger, $driver);

        // Передача данных в Inertia компонент
        return Inertia::render('Messages/MessageComponent', [
            'order' => $order,
            'passenger' => $passenger,
            'messages' => $messages,
            'driver' => $driver,
            'currentUser' => $currentUser,
        ]);
    }

    // получение сообщений между пользователями
    private function getMessagesBetweenUsers($order, $passenger, $driver) {
        return $order->messages()
            ->where(function ($query) use ($passenger, $driver) {
                $query->where(function ($q) use ($passenger, $driver) {
                    $q->where('sender_id', $passenger->id)
                        ->where('recipient_id', $driver->id);
                })->orWhere(function ($q) use ($passenger, $driver) {
                    $q->where('sender_id', $driver->id)
                        ->where('recipient_id', $passenger->id);
                });
            })->get();
    }



    public function showIncoming()
    {
        // Получаем текущего пользователя
        $user = auth()->user();

        // Поездки, где пользователь является водителем
        $driverIncoming = Order::where('driver_id', $user->id)
            ->with(['passengers', 'fromAddress', 'toAddress'])
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'departureCity' => $order->fromAddress->city ?? 'Unknown',
                    'arrivalCity' => $order->toAddress->city ?? 'Unknown',
                    'dateTimeDeparture' => $order->date_time_departure ? Carbon::parse($order->date_time_departure)->format('Y-m-d H:i') : 'Unknown',
                    'passengers' => $order->passengers,
                ];
            });

        // Логирование данных $driverIncoming
       // Log::info('Driver Incoming Orders:', $driverIncoming->toArray());

        // Поездки, где пользователь является пассажиром
        $passengerIncoming = $user->passengerOrders()
            ->with(['driver', 'fromAddress', 'toAddress'])
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'departureCity' => $order->fromAddress->city ?? 'Unknown',
                    'arrivalCity' => $order->toAddress->city ?? 'Unknown',
                    'dateTimeDeparture' => $order->date_time_departure ? Carbon::parse($order->date_time_departure)->format('Y-m-d H:i') : 'Unknown',
                    'driver' => $order->driver,
                ];
            });

        // Логирование данных $passengerIncoming
       // Log::info('Passenger Incoming Orders:', $passengerIncoming->toArray());

        // Передаем данные в Inertia компонент
        return Inertia::render('Messages/IncomingMessagesComponent', [
            'driverIncoming' => $driverIncoming,
            'passengerIncoming' => $passengerIncoming,
            'user' => $user,
        ]);
    }

}
