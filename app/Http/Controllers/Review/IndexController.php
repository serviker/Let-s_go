<?php

namespace App\Http\Controllers\Review;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\Order;
use App\Models\Review;

class IndexController extends Controller
{
    public function __invoke() {
        $reviews = Review::with(['sender', 'recipient', 'reviewType', 'order'])->get();
        return view('review.index', compact('reviews'));
    }
}
