<?php

namespace App\Http\Controllers\Order;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\Order;
use App\Models\StatusOrder;
use App\Models\User;
use Inertia\Inertia;

class EditController extends Controller
{
    public function __invoke(Order $order) {

        //$order = Order::findOrFail($order);
        $users = User::all(); // Все клиенты для выбора водителя и пассажира
        $status_orders = StatusOrder::all(); // Все статусы заказа для выбора
        $addresses = Address::all(); // Все адреса для выбора

        return Inertia::render('order.edit', compact('order', 'users', 'status_orders', 'addresses'));
    }
}
