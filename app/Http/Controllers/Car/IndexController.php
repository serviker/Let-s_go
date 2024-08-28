<?php

namespace App\Http\Controllers\Car;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\Car;
use App\Models\Order;
use App\Models\Review;

class IndexController extends BaseController
{
    public function __invoke() {
        //$cars = Car::all();
        $cars = Car::with('user')->get();
        return view('car.index', compact('cars'));
    }
}
