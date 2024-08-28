<?php

namespace App\Http\Controllers\Car;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\Client;
use App\Models\Order;
use App\Models\ReviewType;
use App\Models\StatusOrder;
use App\Models\User;

class CreateController extends BaseController
{
    public function __invoke() {
        $users = User::all(); // получение всех клиентов
        return view('car.create', compact('users'));
    }
}
