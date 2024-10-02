<?php

namespace App\Http\Controllers\Order;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\Driver;
use App\Models\Order;
use App\Models\Passenger;
use App\Models\User;
use App\Notifications\DriverCancelledOrder;
use App\Notifications\PassengerCancelledOrder;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\ValidationException;
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
          /*  if ($isOrderCreated === false) {
                session(['isOrderCreated' => true]);
                return Inertia::render('Orders/DriverOrderDetails', [
                    'order' => $data,
                    'canJoin' => false,
                    'searchCriteria' => $sessionCriteria,
                    'isOrderCreated' => true // Указываем, что поездка успешно создана
                ]);
            } else {*/
                // После перезагрузки не передаем параметр для предотвращения повторной перезагрузки
                session(['isOrderCreated' => false]);
                return Inertia::render('Orders/DriverOrderDetails', [
                    'order' => $data,
                    'canJoin' => false,
                    'searchCriteria' => $sessionCriteria,
                    'isOrderCreated' => false // Перезагрузка больше не нужна
                ]);
            //}
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

        // Отправляем уведомление водителю
        $driver = $order->driver;

        // Логируем информацию о том, что пассажир отменил бронь
      /*  Log::info('Пассажир отменил бронь:', [
            'passenger_name' => $user->name,
            'seats' => $passenger->seats,
            'cancellation_reason' => $request->cancellation_reason,
            'date_time_departure' => $order->date_time_departure,
            'from_city' => $order->fromAddress->city,
            'to_city' => $order->toAddress->city,
        ]); */

        // Уведомление через систему уведомлений Laravel
        $driver->notify(new PassengerCancelledOrder(
            $order,

            $order->date_time_departure, // Дата поездки
            $order->fromAddress->city, // Город отправления
            $order->toAddress->city, // Город прибытия
            $user->name, // Имя пассажира
            $passenger->seats, // Количество мест, которое было забронировано
            $request->cancellation_reason,

        ));


        // Уведомление по email
       /* try {
            Notification::route('mail', $driver->email)
                ->notify(new PassengerCancelledOrder(
                    $order,
                    $user->name, // Имя пассажира
                    $passenger->seats, // Количество мест, которое было забронировано
                    $order->fromAddress->city, // Город отправления
                    $order->toAddress->city, // Город прибытия
                    $order->date_time_departure,
                    $request->cancellation_reason,
                ));
            Log::info('Уведомление отправлено водителю на Email: ' . $driver->id);
        } catch (\Exception $e) {
            Log::error('Не удалось отправить уведомление водителю на Email: ' . $driver->id . '. Ошибка: ' . $e->getMessage());
        } */

        // Возвращаем Inertia-ответ
        return redirect()->route('order.show', ['order' => $orderId])
            ->with('success', 'Вы успешно отменили бронирование.');
//            ->with('notification', [
//                'passenger_name' => $user->name,
//                'cancellation_reason' => $request->cancellation_reason,
//                'date_time_departure' => $order->date_time_departure,
//           ]);

    }


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
          //  Log::error('Order not found: ' . $orderId);
            return redirect()->back()->with('error', 'Order not found');
        }

        // Проверяем, является ли пользователь водителем данного заказа
        if ($order->driver_id !== $user->id) {
           // Log::error('Пользователь не является водителем этого заказа: ' . $user->id);
            return redirect()->back()->with('error', 'You are not the driver of this order');
        }
       /* Log::error('Order found: ' . $orderId);
        Log::error('User found: ' . $user);
        Log::error('Driver found: ' . $user->id);
        // Логируем все данные запроса
        Log::info('Request data:', $request->all());*/

        // Валидация причины отмены
        try {
            $request->validate([
                'cancellation_reason' => 'required|string|max:255',
            ]);
        } catch (ValidationException $e) {
           // Log::error('Validation error: ' . $e->getMessage());
            return redirect()->back()->withErrors($e->validator)->withInput();
        }

        // Логируем значение cancellation_reason
       /* Log::info('Cancellation reason:', [
            'cancellation_reason' => $request->input('cancellation_reason'),
        ]);*/

        // Уведомляем пассажиров о том, что поездка отменена
       /* $passengers = $order->passengers;
        foreach ($passengers as $passenger) {
           // Log::info('Notifying passenger: ' . $passenger->id);
            $passenger->notify(new DriverCancelledOrder($order, $request->cancellation_reason));
        }*/
        $passengers = $order->passengers;
       // Log::info('Found passengers:', ['passengers' => $passengers->pluck('id')]);

        // Уведомляем пассажиров через систему уведомлений и по email
        foreach ($passengers as $passenger) {
            // Отправляем уведомление через систему уведомлений Laravel
            $passenger->notify(new DriverCancelledOrder(
                $order,
                $request->cancellation_reason,
                $user->name, // Имя водителя
                $order->date_time_departure, // Дата поездки
                $order->fromAddress->city, // Город отправления
                $order->toAddress->city // Город прибытия
            ));

            // Отправляем уведомление через email
          /*  try {
                Notification::send($passenger, new DriverCancelledOrder(
                    $order,
                    $request->cancellation_reason,
                    $user->name, // Имя водителя
                    $order->date_time_departure, // Дата поездки
                    $order->fromAddress->city, // Город отправления
                    $order->toAddress->city // Город прибытия
                ));
                Log::info('Уведомление отправлено пассажиру на Email: ' . $passenger->id);
            } catch (\Exception $e) {
                Log::error('Failed to send email notification to passenger: ' . $passenger->id . '. Error: ' . $e->getMessage());
            }*/
        }

        // Удаляем заказ
        $order->passengers()->detach(); // Убираем всех пассажиров из заказа
        $order->delete(); // Удаляем сам заказ
       // Log::info('Order deleted: ' . $orderId);

        // Перенаправляем пользователя с подтверждением отмены
        return redirect()->route('driver.orders')->with('success', 'Trip has been successfully canceled');
    }
}
