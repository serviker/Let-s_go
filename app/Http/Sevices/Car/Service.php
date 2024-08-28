<?php

namespace App\Http\Sevices\Car;

use App\Models\Car;

class Service
{
    public function store($data)
    {
        Car::create($data);
    }

    public function update($car, $data)
    {
        $car->update($data);
    }
}
