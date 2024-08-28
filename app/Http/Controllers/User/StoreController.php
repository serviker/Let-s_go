<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Http\Requests\Car\StoreRequest;
use App\Models\Address;
use App\Models\Client;
use App\Models\Order;
use App\Models\Review;

class StoreController extends BaseController
{
    public function __invoke(StoreRequest $request) {
        $data = $request->validated();
        $this->service->store($data);
        return redirect()->route('client.index');
    }
}
