<?php

namespace App\Http\Controllers\Address;

use App\Http\Controllers\Controller;
use App\Models\Address;

class EditController extends Controller
{
    public function __invoke(Address $address) {

        return view('address.edit', compact('address'));
    }
}
