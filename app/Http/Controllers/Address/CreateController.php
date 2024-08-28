<?php

namespace App\Http\Controllers\Address;

use App\Http\Controllers\Controller;
use App\Models\Address;

class CreateController extends Controller
{
    public function __invoke() {

        return view('address.create');
    }
}
