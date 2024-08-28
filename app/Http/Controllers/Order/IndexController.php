<?php

namespace App\Http\Controllers\Order;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class IndexController extends Controller
{
    public function __invoke()
    {
        $driver = Auth::user();

        if (!$driver) {
            return Inertia::render('order.index', [
                'orders' => [],
            ]);
        }

        $orders = Order::with(['from_address', 'to_address'])
            ->where('user_id', $driver->id)
            ->get();

        return Inertia::render('order.index', [
            'orders' => $orders,
        ]);
    }

    // Метод для отображения всех поездок водителя
    public function driverOrders()
    {
        $driver = Auth::user();

        if (!$driver) {
            return Inertia::render('Orders/DriverOrders', [
                'orders' => [],
            ]);
        }

        $orders = Order::with(['fromAddress', 'toAddress', 'user'])
            ->where('user_id', $driver->id)
            ->get()
            ->map(function ($order) {
                $fromAddress = $order->fromAddress;
                $toAddress = $order->toAddress;
                $driver = $order->user;
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

        return Inertia::render('Orders/DriverOrders', [
            'orders' => $orders,
        ]);
    }
}
