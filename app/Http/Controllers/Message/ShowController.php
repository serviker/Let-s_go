<?php

namespace App\Http\Controllers\Message;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\Message;
use App\Models\Order;
use App\Models\User;
use Inertia\Inertia;

class ShowController extends Controller
{
    /*public function __invoke($orderId, $passengerId) {

      // Получить заказ с соответствующими пассажирами и водителем
        $order = Order::with(['passengers', 'driver'])->findOrFail($orderId);

        // Получить пассажира
        $passenger = User::findOrFail($passengerId);

    //      // Получайте сообщения, в которых пассажир является либо отправителем, либо получателем.
    //    $messages = $order->messages()->where(function ($query) use ($passengerId) {
    //        $query->where('sender_id', $passengerId)
    //            ->orWhere('recipient_id', $passengerId);
    //    })->get();

        // Передайте данные в представление Inertia
   //     return Inertia::render('MessageComponent', [
        //       'order' => $order,
    //        'passenger' => $passenger,
    //        'messages' => $messages
    //    ]);

        $messages = $order->messages()
            ->where(function ($query) use ($passenger) {
                $query->where('sender_id', $passenger->id)
                    ->orWhere('recipient_id', $passenger->id);
            })->get();

        return Inertia::render('Messages/MessageComponent', [
            'order' => $order,
            'passenger' => $passenger,
            'messages' => $messages,
            'driver' => $order->driver,
        ]);
    }*/

    public function __invoke($orderId, $userId = null) {
        // Получить заказ с пассажирами и водителем
        $order = Order::with(['passengers', 'driver'])->findOrFail($orderId);

        if ($userId) {
            // Получить пассажира (или водителя)
            $passenger = User::findOrFail($userId);
            $driver = $order->driver;

            // Получить сообщения между пассажиром и водителем
            $messages = $order->messages()
                ->where(function ($query) use ($passenger, $driver) {
                    $query->where(function ($q) use ($passenger, $driver) {
                        $q->where('sender_id', $passenger->id)
                            ->where('recipient_id', $driver->id);
                    })->orWhere(function ($q) use ($passenger, $driver) {
                        $q->where('sender_id', $driver->id)
                            ->where('recipient_id', $passenger->id);
                    });
                })->get();

            // Передаем данные в компонент Inertia
            return Inertia::render('Messages/MessageComponent', [
                'order' => $order,
                'passenger' => $passenger,
                'messages' => $messages,
                'driver' => $driver,
            ]);
        } else {
            // Начальный запрос (без сообщений)
            return Inertia::render('Messages/MessageComponent', [
                'order' => $order,
                'passenger' => null,
                'messages' => [],
                'driver' => $order->driver,
            ]);
        }
    }

}
