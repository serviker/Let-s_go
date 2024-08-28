<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\Client;
use App\Models\Order;
use App\Models\ReviewType;
use App\Models\StatusOrder;

class CreateController extends BaseController
{
    public function __invoke() {

        return view('client.create');
    }
}
