<?php

namespace App\Http\Controllers\Address;

use App\Http\Controllers\Controller;
use App\Http\Requests\Address\StoreRequest;
use App\Models\Address;

class StoreController extends Controller
{
    public function __invoke(StoreRequest $request) {

        $data = $request->validated();
        Address::create($data);
        return redirect()->route('address.index');
    }
}
