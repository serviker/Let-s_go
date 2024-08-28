<?php

namespace App\Http\Controllers\Address;

use App\Http\Controllers\Controller;
use App\Models\Address;

class IndexController extends Controller
{
    public function __invoke() {

        $addresses = Address::all();
        return view('address.index', compact('addresses'));
    }
}
