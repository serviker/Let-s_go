<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Http\Requests\Car\UpdateRequest;
use App\Models\Address;
use App\Models\Client;
use App\Models\Order;
use App\Models\Review;

class UpdateController extends BaseController
{
    public function __invoke(UpdateRequest $request, Client $client){
        $data = $request->validated();
        $this->service->update($client, $data);
        return redirect()->route('client.show', $client->id);
    }
}
