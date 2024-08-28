<?php

namespace App\Http\Controllers\Car;

use App\Http\Controllers\Controller;
use App\Http\Requests\Car\StoreRequest;
use App\Models\Address;
use App\Models\Car;
use App\Models\Order;
use App\Models\Review;

class StoreController extends BaseController
{
    public function __invoke(StoreRequest $request) {
        $data = $request->validated();
        $this->service->store($data);
        return redirect()->route('car.index');
    }
}
