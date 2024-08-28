<?php

namespace App\Http\Controllers\Address;

use App\Http\Controllers\Controller;
use App\Models\Address;

class ShowController extends Controller
{
    public function __invoke(Address $address) {

        return view('address.show', compact('address'));
    }
}
