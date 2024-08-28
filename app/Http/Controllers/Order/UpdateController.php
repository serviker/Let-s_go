<?php

namespace App\Http\Controllers\Order;

use App\Http\Controllers\Controller;
use App\Http\Requests\Order\UpdateRequest;
use App\Models\Address;
use App\Models\Order;

class UpdateController extends Controller
{
    public function __invoke(UpdateRequest $request, Order $order) {

        $data = $request->validated();
        $order->update($data);
        return redirect()->route('order.show', $order->id)->with('success', 'Order updated successfully!');
    }
}
