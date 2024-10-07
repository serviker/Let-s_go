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

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        // Логирование пользователя
       // Log::info('Текущий пользователь:', ['id' => $user->id]);

        $notifications = $user->notifications()->orderBy('created_at', 'desc')->get();
        // Возвращаем Inertia ответ с уведомлениями
           return Inertia::render('Notifications/NotificationComponent', [
              'notifications' => $notifications,
          ]);
       // Логирование извлеченных уведомлений
       /* Log::info('Уведомления пользователя:', ['notifications' => $notifications]);
          return response()->json($notifications);*/
    }

    public function bookingNotification()
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        // Логирование пользователя
        // Log::info('Текущий пользователь:', ['id' => $user->id]);

        $notifications = $user->notifications()->orderBy('created_at', 'desc')->get();
        // Возвращаем Inertia ответ с уведомлениями
        return Inertia::render('Notifications/BookingNotificationComponent', [
            'notifications' => $notifications,
        ]);
        // Логирование извлеченных уведомлений
        /* Log::info('Уведомления пользователя:', ['notifications' => $notifications]);
           return response()->json($notifications);*/
    }

    public function markAsRead($id)
    {
        $user = Auth::user();
        $notification = $user->notifications()->find($id);

        if (!$notification) {
            return response()->json(['error' => 'Notification not found'], 404);
        }

        $notification->markAsRead();

        return response()->json(['message' => 'Notification marked as read']);
    }

    public function destroy($id)
    {
        $user = Auth::user();
        $notification = $user->notifications()->find($id);

        if (!$notification) {
            return response()->json(['error' => 'Notification not found'], 404);
        }

        $notification->delete();

        return response()->json(['message' => 'Notification deleted']);
    }

    public function unreadCount()
    {
        $unreadCount = auth()->user()->unreadNotifications()->count();
        return response()->json(['unreadCount' => $unreadCount]);
    }
}
