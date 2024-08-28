<?php

namespace App\Http\Controllers\Message;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\Message;
use App\Models\Order;

class IndexController extends Controller
{
    public function __invoke() {
        // $messages = Message::all();
        $messages = Message::with(['sender', 'recipient'])->get();
        return view('message.index', compact('messages'));
    }
}
