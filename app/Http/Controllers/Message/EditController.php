<?php

namespace App\Http\Controllers\Message;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\Message;
use App\Models\Order;

class EditController extends Controller
{
    public function __invoke(Message $message) {
        return view('message.edit', compact('message'));
    }
}
