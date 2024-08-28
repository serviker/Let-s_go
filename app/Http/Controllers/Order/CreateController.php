<?php

namespace App\Http\Controllers\Order;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\StatusOrder;
use App\Models\User;
use Inertia\Inertia;

class CreateController extends Controller
{
    public function __invoke() {

       /* $drivers = User::whereHas('driver')->get(); // Все пользователи, которые являются водителями
        $passengers = User::whereHas('passenger')->get(); // Все пользователи, которые являются пассажирами
        $status_orders = StatusOrder::all(); // Все статусы заказа для выбора
        $addresses = Address::all(); // Все адреса для выбора

        return Inertia::render('Orders/DriverOrderCreate', compact('drivers', 'passengers', 'status_orders', 'addresses'));*/

        return Inertia::render('Orders/DriverOrderCreate');
    }
}
