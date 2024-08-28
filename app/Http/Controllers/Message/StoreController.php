<?php

namespace App\Http\Controllers\Message;

use App\Http\Controllers\Controller;
use App\Http\Requests\Address\StoreRequest;
use App\Models\Address;
use App\Models\Message;
use App\Models\Order;

class StoreController extends Controller
{
    public function __invoke(StoreRequest $request) {
        $data = $request->validated();
        Message::create($data);
        return redirect()->route('message.index');
    }
}
