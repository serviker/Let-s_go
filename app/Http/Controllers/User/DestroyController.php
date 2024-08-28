<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\Client;
use App\Models\Order;
use App\Models\Review;

class DestroyController extends BaseController
{
    public function __invoke(Client $client)
    {
        $client->delete();
        return redirect()->route('client.index');
    }
}
