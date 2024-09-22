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

       /* $sessionCriteria = session('searchCriteria', []);

        // Извлекаем конкретные параметры
        $departureCity = $sessionCriteria['departureCity'] ?? null;
        $arrivalCity = $sessionCriteria['arrivalCity'] ?? null;
        $seats = $sessionCriteria['seats'] ?? null;
        $date = $sessionCriteria['date'] ?? null; */


        // Получение данных из сессии
        $searchCriteria = session('searchCriteria', [
            'departureCity' => '',
            'arrivalCity' => '',
            'date' => '',
            'seats' => 1
        ]); // Замените 'searchCriteria' на нужный вам ключ
        // Проверяем запрос и обновляем критерии, если они были переданы
       /* if ($request->has(['departureCity', 'arrivalCity', 'date', 'seats'])) {
            $searchCriteria = [
                'departureCity' => $request->input('departureCity'),
                'arrivalCity' => $request->input('arrivalCity'),
                'date' => $request->input('date'),
                'seats' => $request->input('seats'),
            ];
            session()->put('searchCriteria', $searchCriteria);
        }*/

        // Загружаем найденные поездки из сессии
        $orders = session('foundOrders', []);

        return Inertia::render('Dashboard', [
            'auth' => ['user' => $user],
            'orders' => $orders,
            'searchCriteria' => $searchCriteria, // Передаем параметры в Dashboard
        ]);
    }

}

