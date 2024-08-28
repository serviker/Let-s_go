<?php

namespace App\Http\Controllers\Review;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\Client;
use App\Models\Order;
use App\Models\Review;
use App\Models\ReviewType;
use App\Models\StatusOrder;
use App\Models\User;

class EditController extends Controller
{
    public function __invoke(Review $review) {
        $clients = User::all();
        $reviewTypes = ReviewType::all();
        $orders = Order::with(['addressFrom', 'addressTo'])->get();
        return view('review.edit', compact('review', 'clients', 'reviewTypes', 'orders'));
    }
}
