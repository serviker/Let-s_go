<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        // Логирование пользователя
       // Log::info('Текущий пользователь:', ['id' => $user->id]);

        $notifications = $user->notifications()->orderBy('created_at', 'desc')->get();
        // Возвращаем Inertia ответ с уведомлениями
        return Inertia::render('Notifications/NotificationIncomingComponent', [
            'notifications' => $notifications,
        ]);
      /*  // Логирование извлеченных уведомлений
        Log::info('Уведомления пользователя:', ['notifications' => $notifications]);
        return response()->json($notifications);*/
    }

    public function markAsRead($id)
    {
        $notification = Auth::user()->notifications()->find($id);
        if ($notification) {
            $notification->markAsRead();
            return response()->json(['message' => 'Notification marked as read.']);
        }
        return response()->json(['message' => 'Notification not found.'], 404);
    }
}
