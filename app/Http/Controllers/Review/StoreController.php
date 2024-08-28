<?php

namespace App\Http\Controllers\Review;

use App\Http\Controllers\Controller;
use App\Http\Requests\Car\StoreRequest;
use App\Models\Address;
use App\Models\Order;
use App\Models\Review;

class StoreController extends Controller
{
    public function __invoke(StoreRequest $request) {
        $data = $request->validated();
        Review::create($data);
        return redirect()->route('review.index');
    }
}
