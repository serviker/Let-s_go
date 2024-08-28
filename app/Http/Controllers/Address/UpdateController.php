<?php

namespace App\Http\Controllers\Address;

use App\Http\Controllers\Controller;
use App\Http\Requests\Car\UpdateRequest;
use App\Models\Address;

class UpdateController extends Controller
{
    public function __invoke(UpdateRequest $request, Address $address) {

        $data = $request->validated();
        $address->update($data);
        return redirect()->route('address.show', $address->id);
    }
}
