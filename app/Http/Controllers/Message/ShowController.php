<?php

namespace App\Http\Controllers\Message;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\Message;
use App\Models\Order;

class ShowController extends Controller
{
    public function __invoke(Message $message) {
        return view('message.show', compact('message'));
    }
}
