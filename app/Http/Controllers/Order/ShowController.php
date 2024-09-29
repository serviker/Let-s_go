<?php

namespace App\Http\Controllers\Order;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\Driver;
use App\Models\Order;
use App\Models\Passenger;
use App\Models\User;
use App\Notifications\OrderCancelled;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class ShowController extends Controller
{
    public function __invoke(Order $order)
    {
        // Get the authenticated user
        $user = Auth::user();

        // Извлечь критерии поиска из session
        $sessionCriteria = session('searchCriteria', []);

        // Extract from and to addresses
        $fromAddress = $order->fromAddress;
        $toAddress = $order->toAddress;

        // Get the driver information via driver_id
       // $driver = User::with('cars')->find($order->driver_id);
       // $car = $driver ? $driver->cars->first() : null; // Проверьте наличие водителя

        $driver = Driver::with('user.cars')->find($order->driver_id);

        // Проверяем, что водитель существует и у него есть машины
        $car = ($driver && $driver->user && $driver->user->cars->isNotEmpty()) ? $driver->user->cars->first() : null;


       /* if ($driver) {
            Log::info('Order/ShowController Driver info:', ['driver_id' => $driver->id, 'user_id' => $driver->user->id]);
        } else {
            Log::warning('Order/ShowController: Driver not found for order', ['driver_id' => $order->driver_id]);
        }
        Log::info('Order/ShowController Retrieved Driver:', [
            'driver_id' => $driver ? $driver->id : 'Not Found',
            'user_id' => $driver && $driver->user ? $driver->user->id : 'No User'
        ]);*/


       // Log::info('Order/ShowController $driver:', ['driver_id' => $order->driver_id]);

      //  Log::info('Order/ShowController Driver info:', ['driver_id' => $driver->id, 'user_id' => $user->id]);
        // Process passengers list
        $passengers = $order->passengers->map(function ($passenger) {
            return [
                'id' => $passenger->id,
                'name' => $passenger->name,
                'photoUrl' => $passenger->photoUrl ? asset('/' . $passenger->photoUrl) : null,
                'departureCity' => $passenger->pivot->departure_city ?? 'Unknown',
                'arrivalCity' => $passenger->pivot->arrival_city ?? 'Unknown',
                'seats' => $passenger->pivot->seats
            ];
        });
      //  Log::info('Order/ShowController $passengers:', $passengers->toArray());
        // Check if the user is a passenger in the order
        $isPassenger = $order->passengers()->where('passenger_id', $user->id)->exists();

        // Build data array for view
        $data = [
            'id' => $order->id,
            'departureAddress' => $fromAddress->street . ' ' . $fromAddress->house ?? 'Unknown',
            'arrivalAddress' => $toAddress->street . ' ' . $toAddress->house ?? 'Unknown',
            'fromCity' => $fromAddress->city ?? 'Unknown',
            'toCity' => $toAddress->city ?? 'Unknown',
            'intermediate_addresses' => $order->intermediateAddresses()->pluck('city')->toArray(),
            'price' => (float)$order->price,
            'driverName' => $driver && $driver->user ? $driver->user->name : 'Unknown',
            'carName' => $car ? ($car->brand . ' ' . $car->model) : 'No car',
            'carColor' => $car ? $car->color : 'No car',
            'carPhoto' => $car && $car->photoUrl ? asset('/' . $car->photoUrl) : null,
            'dateTimeDeparture' => $order->date_time_departure ?? 'Unknown',
            'driverPhotoUrl' => $driver && $driver->user && $driver->user->photoUrl ? asset('/' . $driver->user->photoUrl) : null,
            'driverId' => $driver ? $driver->id : 0,
            'description' => $order->description ?? 'No description provided',
            'availableSeats' => $order->available_seats ?? 'No available seats',
            'passengers' => $passengers,
            'isBooked' => $isPassenger,
            'searchCriteria' => $sessionCriteria
        ];
       // Log::info('Order/ShowControllerOrder Created $data:', $data);

        // Check if the authenticated user is the driver
        if ($user && $user->id === $order->driver_id) {
            // Проверяем, есть ли в сессии флаг isOrderCreated
            $isOrderCreated = session('isOrderCreated', false);

            // Если поездка создается впервые, устанавливаем флаг в сессию
            if ($isOrderCreated === false) {
                session(['isOrderCreated' => true]);
                return Inertia::render('Orders/DriverOrderDetails', [
                    'order' => $data,
                    'canJoin' => false,
                    'searchCriteria' => $sessionCriteria,
                    'isOrderCreated' => true // Указываем, что поездка успешно создана
                ]);
            } else {
                // После перезагрузки не передаем параметр для предотвращения повторной перезагрузки
                session(['isOrderCreated' => false]);
                return Inertia::render('Orders/DriverOrderDetails', [
                    'order' => $data,
                    'canJoin' => false,
                    'searchCriteria' => $sessionCriteria,
                    'isOrderCreated' => false // Перезагрузка больше не нужна
                ]);
            }
        }

        // If the user is not the driver, but a passenger, show PassengerOrderDetails
        return Inertia::render('Orders/PassengerOrderDetails', [
            'order' => $data,
            'canJoin' => !$isPassenger, // User can join if not already a passenger
            'searchCriteria' => $sessionCriteria
        ]);
    }

    public function joinOrder(Request $request, $orderId)
    {
        $user = Auth::user();
        $sessionCriteria = session('searchCriteria', []);
        if (!$user) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        $order = Order::find($orderId);

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        if ($order->available_seats <= 0) {
            return response()->json(['message' => 'No available seats'], 400);
        }

        // Получаем данные из критериев
        $departureCity = $sessionCriteria['departureCity'] ?? null;
        $arrivalCity = $sessionCriteria['arrivalCity'] ?? null;
        $seats = $sessionCriteria['seats'] ?? 1; // Количество мест по умолчанию — 1

        // Проверяем, свободны ли заявленные места
        if ($order->available_seats < $seats) {
            return back()->withErrors('Недостаточно свободных мест для бронирования.');
        }

        // Проверяем, что пользователь не является пассажиром в этом заказе
        $exists = DB::table('order_passenger')
            ->where('order_id', $orderId)
            ->where('passenger_id', $user->id)
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'Passenger already assigned to this order'], 400);
        }

        // Добавляем пользователя в список пассажиров
        $order->passengers()->attach($user->id, [
            'seats' => $seats,
            'departure_city' => $departureCity,
            'arrival_city' => $arrivalCity
        ]);

        $order->available_seats -= $seats;
        $order->save();

        return redirect()->route('order.show', ['order' => $orderId]);
    }

    public function cancelOrderPassenger(Request $request, $orderId)
    {
        $user = Auth::user();

        // Проверяем, авторизован ли пользователь
        if (!$user) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        $order = Order::find($orderId);

        // Проверяем, существует ли заказ
        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        // Проверяем, является ли пользователь пассажиром в этом заказе
        $passenger = DB::table('order_passenger')
            ->where('order_id', $orderId)
            ->where('passenger_id', $user->id)
            ->first();

        if (!$passenger) {
            return response()->json(['message' => 'Passenger not found in this order'], 400);
        }

        // Увеличиваем количество свободных мест
        $order->available_seats += $passenger->seats;
        $order->save();

        // Удаляем пассажира из таблицы order_passenger
        $order->passengers()->detach($user->id);

        // Возвращаем Inertia-ответ
       /* try {
            return Inertia::render('Orders/PassengerOrderDetails', [
                'order' => $order,
            ]);
        } catch (Exception $e) {
            dd($e->getMessage());
        }*/

        return redirect()->route('order.show', ['order' => $orderId]);
    }

 /*   public function cancelOrderDriver(Request $request, $orderId)
    {
        // Валидация: проверяем, что причина отмены передана в запросе
        $request->validate([
            'cancellation_reason' => 'required|string|max:255',
        ]);

        $user = Auth::user();

        // Проверяем, авторизован ли пользователь
        if (!$user) {
            return redirect()->back()->with('error', 'User not authenticated');
        }

        // Получаем заказ
        $order = Order::find($orderId);

        // Проверяем, существует ли заказ
        if (!$order) {
            return redirect()->back()->with('error', 'Order not found');
        }

        // Получаем причину отмены из запроса
        $request->validate([
            'cancellation_reason' => 'required|string|max:255',
        ]);

        $cancellationReason = $request->input('cancellation_reason');

        // Уведомляем пассажиров о том, что поездка отменена
        $passengers = $order->passengers;
        foreach ($passengers as $passenger) {
            Log::info('Notifying passenger: ' . $passenger->id);
            // Отправляем уведомление каждому пассажиру
            Notification::send($passenger, new OrderCancelled($order, $cancellationReason));
        }


        // Уведомляем пассажиров о том, что поездка отменена
        $passengers = $order->passengers;
        foreach ($passengers as $passenger) {
            // Здесь можно отправить уведомление пассажирам
            // Например, используя событие или e-mail уведомление
        }

        // Удаляем заказ
        $order->passengers()->detach(); // Убираем всех пассажиров из заказа
        $order->delete(); // Удаляем сам заказ

        // Перенаправляем пользователя с подтверждением отмены
        return redirect()->route('driver.orders');//->with('success', 'Trip has been successfully canceled');
    }*/

    public function cancelOrderDriver(Request $request, $orderId)
    {
        $user = Auth::user();

        // Проверяем, авторизован ли пользователь
        if (!$user) {
            return redirect()->back()->with('error', 'User not authenticated');
        }

        // Получаем заказ
        $order = Order::find($orderId);

        // Проверяем, существует ли заказ
        if (!$order) {
            Log::error('Order not found: ' . $orderId);
            return redirect()->back()->with('error', 'Order not found');
        }

        // Проверяем, является ли пользователь водителем данного заказа
        if ($order->driver_id !== $user->id) {
            Log::error('User is not the driver of this order: ' . $user->id);
            return redirect()->back()->with('error', 'You are not the driver of this order');
        }

        // Валидация причины отмены
        $request->validate([
            'cancellation_reason' => 'required|string|max:255',
        ]);

        // Уведомляем пассажиров о том, что поездка отменена
        $passengers = $order->passengers;
        foreach ($passengers as $passenger) {
            Log::info('Notifying passenger: ' . $passenger->id);
            Notification::send($passenger, new OrderCancelled($order, $request->cancellation_reason));
        }

        // Удаляем заказ
        $order->passengers()->detach(); // Убираем всех пассажиров из заказа
        $order->delete(); // Удаляем сам заказ
        Log::info('Order deleted: ' . $orderId);

        // Перенаправляем пользователя с подтверждением отмены
        return redirect()->route('driver.orders')->with('success', 'Trip has been successfully canceled');
    }


}
