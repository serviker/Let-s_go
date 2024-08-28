<?php

namespace App\Http\Controllers\Review;

use App\Http\Controllers\Controller;
use App\Http\Requests\Car\UpdateRequest;
use App\Models\Address;
use App\Models\Order;
use App\Models\Review;

class UpdateController extends Controller
{
    public function __invoke(UpdateRequest $request, Review $review) {
        $data = $request->validated();
        $review->update($data);
        return redirect()->route('review.show', $review->id);
    }
}
