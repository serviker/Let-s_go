<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\Client;
use App\Models\Order;
use App\Models\Review;

class IndexController extends BaseController
{
    public function __invoke() {
        $clients = Client::all();
        return view('client.index', compact('clients'));
    }
}
