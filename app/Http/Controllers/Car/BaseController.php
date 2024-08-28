<?php

namespace App\Http\Controllers\Car;

use App\Http\Controllers\Controller;
use App\Sevices\Car\Service;

class BaseController extends Controller
{
    public $service;

    public function __construct(Service $service)
    {
        $this->service = $service;
    }
}
