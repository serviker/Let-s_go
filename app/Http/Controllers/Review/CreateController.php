<?php

namespace App\Http\Controllers\Review;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\Client;
use App\Models\Order;
use App\Models\ReviewType;
use App\Models\StatusOrder;
use App\Models\User;

class CreateController extends Controller
{
    public function __invoke() {

        $clients = User::all();
        $reviewTypes = ReviewType::all();
        $orders = Order::with(['addressFrom', 'addressTo'])->get();
        return view('review.create', compact('clients', 'reviewTypes', 'orders'));
    }
}
