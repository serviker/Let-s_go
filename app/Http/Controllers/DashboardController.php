<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Order;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $orders = $user->orders; // Предполагается, что у пользователя есть связанные заказы

        // Получение данных из сессии
        $searchCriteria = session('searchCriteria', []); // Замените 'searchCriteria' на нужный вам ключ

        $searchCriteria = [
            'departureCity' => $request->input('departureCity'),
            'arrivalCity' => $request->input('arrivalCity'),
            'date' => $request->input('date'),
            'seats' => $request->input('seats'),
        ];

        return Inertia::render('Dashboard', [
            'auth' => ['user' => $user],
            'orders' => $orders,
            'searchCriteria' => $searchCriteria, // Передаем параметры в Dashboard
        ]);
    }

}

