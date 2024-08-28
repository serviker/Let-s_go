<?php

namespace App\Http\Controllers\Address;

use App\Http\Controllers\Controller;
use App\Models\Address;

class DestroyController extends Controller
{
    public function __invoke(Address $address) {

        $address->delete();
        return redirect()->route('address.index');
    }
}
