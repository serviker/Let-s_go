<?php

namespace App\Http\Controllers\Message;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\Client;
use App\Models\Message;
use App\Models\Order;

class CreateController extends Controller
{
    public function __invoke() {
        $clients = Client::all();
        return view('message.create', compact('clients'));
    }
}
