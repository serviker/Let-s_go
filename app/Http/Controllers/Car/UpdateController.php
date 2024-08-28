<?php

namespace App\Http\Controllers\Car;

use App\Http\Controllers\Controller;
use App\Http\Requests\Car\UpdateRequest;
use App\Models\Address;
use App\Models\Car;
use App\Models\Order;
use App\Models\Review;

class UpdateController extends BaseController
{
    public function __invoke(UpdateRequest $request, Car $car) {
        $data = $request->validated();
        $this->service->update($car, $data);
        return redirect()->route('car.show', $car->id);
    }
}
