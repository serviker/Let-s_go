<?php

namespace App\Http\Controllers;

use App\Models\Order;
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

        // Извлекаем только нужные уведомления
        $notifications = $user->notifications()
            ->whereIn('type', [
                'App\Notifications\DriverCancelledOrder',
                'App\Notifications\PassengerCancelledOrder'
            ])
            ->orderBy('created_at', 'desc')
            ->get();

        // Возвращаем Inertia ответ с уведомлениями
        return Inertia::render('Notifications/NotificationComponent', [
            'notifications' => $notifications,
        ]);
    }


    /*  public function bookingNotification()
      {
          $user = Auth::user();

          if (!$user) {
              return response()->json(['error' => 'Unauthorized'], 401);
          }

          // Извлекаем уведомления пользователя для бронирований
          $notifications = $user->notifications()
              ->whereIn('type', ['App\Notifications\BookingRequestNotification', 'App\Notifications\BookingResponseNotification'])
              ->orderBy('created_at', 'desc')
              ->get();

          // Массив для хранения заказов
          $orders = [];

          foreach ($notifications as $notification) {
              // Проверяем, является ли уведомление запросом или ответом на бронирование
              if ($notification->type === 'App\Notifications\BookingRequestNotification') {
                  // Водительское уведомление о бронировании
                  if (isset($notification->data['order_id'])) {
                      $order = Order::with('passengerRequests')->find($notification->data['order_id']);

                      if ($order) {
                          $order->passengerRequests = $order->passengerRequests->map(function ($request) use ($order) {
                              $request->order_id = $order->id;
                              return $request;
                          });

                          $orders[] = $order;
                      }
                  }
              } elseif ($notification->type === 'App\Notifications\BookingResponseNotification') {
                  // Пассажирское уведомление о статусе бронирования
                  if (isset($notification->data['order_id'])) {
                      $order = Order::find($notification->data['order_id']);

                      if ($order) {
                          // Добавляем уведомление для пассажира о статусе брони
                          $order->response_status = $notification->data['status'];
                          $orders[] = $order;
                      }
                  }
              }
          }

          // Возвращаем Inertia ответ с заказами
          return Inertia::render('Notifications/BookingNotificationComponent', [
              'orders' => $orders,
              'notifications' => $notifications,
          ]);
      } */
    public function bookingNotification()
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // Извлекаем уведомления пользователя для бронирований
        $notifications = $user->notifications()
            ->whereIn('type', ['App\Notifications\BookingRequestNotification',
                'App\Notifications\BookingRequestApproved',
                'App\Notifications\BookingRequestDenied'])
            ->orderBy('created_at', 'desc')
            ->get();

        // Извлекаем все уникальные ID заказов для уведомлений
        $orderIds = $notifications->pluck('data.order_id')->unique()->toArray();

        // Получаем заказы с запросами пассажиров
        $orders = Order::whereIn('id', $orderIds)->with('passengerRequests')->get();
        // Получаем заказы с водителями
       // $orders = Order::whereIn('id', $orderIds)->with('driver')->get();

        // Добавляем статус ответа в заказы, если есть такие уведомления
        foreach ($notifications as $notification) {
            if ($notification->type === 'App\Notifications\BookingRequestApproved' || $notification->type === 'App\Notifications\BookingRequestDenied') {
                $order = $orders->where('id', $notification->data['order_id'])->first();
                if ($order && isset($notification->data['status'])) {
                    // Устанавливаем статус ответа, если он существует
                    $order->response_status = $notification->data['status']; // Добавляем статус
                }
            }
        }

        return Inertia::render('Notifications/BookingNotificationComponent', [
            'orders' => $orders,
            'notifications' => $notifications,
        ]);
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
