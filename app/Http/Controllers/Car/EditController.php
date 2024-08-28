<?php

namespace App\Http\Controllers\Car;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\Car;
use App\Models\Client;
use App\Models\Order;
use App\Models\Review;
use App\Models\ReviewType;
use App\Models\StatusOrder;
use App\Models\User;

class EditController extends BaseController
{
    public function __invoke(Car $car) {
        // $car = Car::findOrFail($car);
        $users = User::all();
        return view('car.edit', compact('car', 'users'));
    }
}
