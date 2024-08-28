<?php

namespace App\Http\Controllers\Review;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\Order;
use App\Models\Review;

class ShowController extends Controller
{
    public function __invoke(Review $review) {

        return view('review.show', compact('review'));
    }
}
