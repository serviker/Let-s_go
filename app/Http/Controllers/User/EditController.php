<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\Client;
use App\Models\Order;
use App\Models\Review;
use App\Models\ReviewType;
use App\Models\StatusOrder;

class EditController extends BaseController
{
    public function __invoke(Client $client) {
        return view('client.edit', compact('client'));
    }
}
