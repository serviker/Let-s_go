<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Sevices\Client\Service;

class BaseController extends Controller{

    public $service;

    public function __construct(Service $service)
    {
        $this->service = $service;
    }
}
