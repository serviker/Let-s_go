<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\Client;
use App\Models\Order;
use App\Models\Review;

class ShowController extends BaseController
{
    public function __invoke(Client $client) {

        return view('client.show', compact('client'));
    }
}
