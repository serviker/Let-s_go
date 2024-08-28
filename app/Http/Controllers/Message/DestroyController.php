<?php

namespace App\Http\Controllers\Message;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\Message;
use App\Models\Order;

class DestroyController extends Controller
{
    public function __invoke(Message $message) {
        $message->delete();
        return redirect()->route('message.index');
    }
}
