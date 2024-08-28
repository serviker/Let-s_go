<?php

namespace App\Http\Controllers\Car;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\Car;
use App\Models\Order;
use App\Models\Review;

class DestroyController extends BaseController
{
    public function __invoke(Car $car) {
        $car->delete();
        return redirect()->route('car.index');
    }
}
