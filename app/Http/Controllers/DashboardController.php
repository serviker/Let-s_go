<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Order;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $orders = $user->orders; // Предполагается, что у пользователя есть связанные заказы

        return Inertia::render('Dashboard', [
            'auth' => ['user' => $user],
            'orders' => $orders,
        ]);
    }
}
