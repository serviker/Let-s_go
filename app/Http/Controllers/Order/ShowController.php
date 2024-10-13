<?php

namespace App\Http\Controllers\Order;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\Driver;
use App\Models\Order;
use App\Models\Passenger;
use App\Models\PassengerRequest;
use App\Models\User;
use App\Notifications\BookingRequestApproved;
use App\Notifications\BookingRequestDenied;
use App\Notifications\BookingRequestNotification;
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
        Log::info('Before Order/ShowController saving order:', ['date_time_departure' => $order->date_time_departure]);
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


       // if ($driver) {
       //     Log::info('Order/ShowController Driver info:', ['driver_id' => $driver->id, 'user_id' => $driver->user->id]);
       // } else {
       //     Log::warning('Order/ShowController: Driver not found for order', ['driver_id' => $order->driver_id]);
       // }
       // Log::info('Order/ShowController Retrieved Driver:', [
       //     'driver_id' => $driver ? $driver->id : 'Not Found',
       //     'user_id' => $driver && $driver->user ? $driver->user->id : 'No User'
       // ]);


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

        // Проверьте, что passengerRequests не пустой
        $passengerRequests = $order->passengerRequests;

        if ($passengerRequests->isEmpty()) {
            Log::info('Нет запросов пассажиров для заказа с ID: ' . $order->id);
        } else {
            Log::info('Запросы пассажиров загружены для заказа:', $passengerRequests->toArray());
        }

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
            'searchCriteria' => $sessionCriteria,
            'status_order_id' => $order->status_order_id, // Передаем статус бронирования
            'passengerRequests' => $passengerRequests,
        ];
        Log::info('After Order/ShowController saving order:', ['date_time_departure' => $order->date_time_departure]);
        Log::info('Order/ShowController Created $data:', $data);


        // Check if the authenticated user is the driver
        if ($user && $user->id === $order->driver_id) {
            // Проверяем, есть ли в сессии флаг isOrderCreated
            $isOrderCreated = session('isOrderCreated', false);

            // Если поездка создается впервые, устанавливаем флаг в сессию
          //  if ($isOrderCreated === false) {
          //      session(['isOrderCreated' => true]);
          //      return Inertia::render('Orders/DriverOrderDetails', [
          //          'order' => $data,
         //           'canJoin' => false,
          //          'searchCriteria' => $sessionCriteria,
          //          'isOrderCreated' => true // Указываем, что поездка успешно создана
          //      ]);
          //  } else {
                // После перезагрузки не передаем параметр для предотвращения повторной перезагрузки
                session(['isOrderCreated' => false]);
                return Inertia::render('Orders/DriverOrderDetails', [
                    'order' => $data,
                    'canJoin' => false,
                    'searchCriteria' => $sessionCriteria,
                    'isOrderCreated' => false, // Перезагрузка больше не нужна
                    'flash' => session()->get('flash', []), // Передаем flash-сообщения в компонент
                ]);
            //}
        }

        // If the user is not the driver, but a passenger, show PassengerOrderDetails
        return Inertia::render('Orders/PassengerOrderDetails', [
            'order' => $data,
            'canJoin' => !$isPassenger, // User can join if not already a passenger
            'searchCriteria' => $sessionCriteria,
            'flash' => session()->get('flash', []), // Передаем flash-сообщения в компонент
        ]);
    }

   /* public function __invoke(Order $order)
    {
        // Получаем аутентифицированного пользователя
        $user = Auth::user();
        // Получение даты отправления из сессии
        //$date_time_departure = session('date_time_departure', $order->date_time_departure);

        Log::info('Лог перед изменениями __invoke/ShowController saving order:', ['date_time_departure' => $order->date_time_departure]);

        // Извлекаем критерии поиска из session
        $sessionCriteria = session('searchCriteria', []);

        // Извлекаем адреса отправления и прибытия
        $fromAddress = $order->fromAddress;
        $toAddress = $order->toAddress;

        // Получаем информацию о водителе через driver_id
        $driver = Driver::with('user.cars')->find($order->driver_id);

        // Проверяем, что водитель существует и у него есть машины
        $car = ($driver && $driver->user && $driver->user->cars->isNotEmpty()) ? $driver->user->cars->first() : null;

        // Обрабатываем список пассажиров
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

        // Проверяем, является ли пользователь пассажиром в этом заказе
        $isPassenger = $order->passengers()->where('passenger_id', $user->id)->exists();

        // Загружаем запросы от пассажиров
        $passengerRequests = $order->passengerRequests;
        if ($passengerRequests->isEmpty()) {
            Log::info('Нет запросов пассажиров для заказа с ID: ' . $order->id);
        } else {
            Log::info('Запросы пассажиров загружены для заказа:', $passengerRequests->toArray());
        }

        // Формируем данные для передачи в представление
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
            'searchCriteria' => $sessionCriteria,
            'status_order_id' => $order->status_order_id,
            'passengerRequests' => $passengerRequests,
        ];
        Log::info('Лог после изменениями __invoke/ShowController saving order:', ['date_time_departure' => $order->date_time_departure]);

        // Проверяем, является ли пользователь водителем
        if ($user && $user->id === $order->driver_id) {
            $isOrderCreated = session('isOrderCreated', false);
            session(['isOrderCreated' => false]);
            return Inertia::render('Orders/DriverOrderDetails', [
                'order' => $data,
                'canJoin' => false,
                'searchCriteria' => $sessionCriteria,
                'isOrderCreated' => false,
                'flash' => session()->get('flash', []),
            ]);
        }

        // Если пользователь пассажир
        return Inertia::render('Orders/PassengerOrderDetails', [
            'order' => $data,
            'canJoin' => !$isPassenger,
            'searchCriteria' => $sessionCriteria,
            'flash' => session()->get('flash', []),
        ]);
    }*/


    /* Метод requestBooking
    Этот метод обрабатывает запросы на бронирование, в зависимости от статуса заказа.
    Если статус заказа "После подтверждения водителем", он создает запрос на бронирование.
     Если статус "Мгновенное бронирование", он вызывает метод joinOrder.
     */
    public function requestBooking(Request $request, $orderId)
    {
        Log::info('Полученные данные запроса:', ['requestBooking request_data' => $request->all()]); // Логируем все данные запроса

        $order = Order::findOrFail($orderId);

        // Проверяем, есть ли доступные места
        if ($order->available_seats <= 0) {
            Log::info('Нет доступных мест для бронирования.', ['order' => $order]);
            session()->flash('message', 'Нет доступных мест для бронирования.');
            return redirect()->route('order.show', ['order' => $orderId]);
        }

        // Проверяем статус заказа
        if ($order->statusOrder->name_status === 'После подтверждения водителем') {
            // Логика запроса на бронирование с подтверждением водителя
            $order->passengerRequests()->create([
                'passenger_id' => Auth::id(),
                'message' => $request->input('message'), // Сохраняем текст сообщения
            ]);

            // Уведомляем водителя о запросе на бронирование
            $order->driver->notify(new BookingRequestNotification($order, Auth::user()->name));

            session()->flash('message', 'Запрос на бронирование отправлен водителю.');
            return redirect()->route('order.show', ['order' => $orderId]);
        }

        session()->flash('message', 'Невозможно забронировать этот заказ.');
        return redirect()->route('order.show', ['order' => $orderId]);
    }


    /*Метод showBookingRequests
    Этот метод отображает запросы на бронирование для заданного водителя.
     Он загружает все заказы, которые имеют запросы от пассажиров, которые еще не были одобрены.*/
    public function showBookingRequests($driverId)
    {
        $orders = Order::where('driver_id', $driverId)
            ->with(['passengerRequests' => function ($query) {
                // Убедитесь, что мы выбираем только те запросы, которые еще не были одобрены
                $query->whereNull('approved_at')
                    ->select('id', 'passenger_id', 'order_id', 'message'); // Включаем поле message
            }])
            ->has('passengerRequests') // Оставляем только те заказы, у которых есть запросы
            ->get();

        // Для проверки данных
        Log::info('Orders showBookingRequests:', $orders->toArray());

        return Inertia::render('Bookings/BookingComponent', [
            'orders' => $orders,
        ]);
    }


    /*Метод respondToBookingRequest
    Этот метод отвечает на запросы на бронирование.
    Если запрос одобрен, он вызывает метод joinOrder, чтобы добавить пассажира к поездке.
     В противном случае он удаляет запрос.*/
   /* public function respondToBookingRequest(Request $request, $orderId, $passengerId)
    {
        $order = Order::findOrFail($orderId);
        $passengerRequest = $order->passengerRequests()
            ->where('passenger_id', $passengerId)
            ->firstOrFail();

        Log::info('respondToBookingRequest Data: ', $request->all());

        if ($request->approve === true) {
        //  if ($request->approve) {
            $passengerRequest->approved_at = now();// Заполняем колонку approved_at текущей датой
            $passengerRequest->save(); // Сохраняем изменения

            // Отправляем уведомление о подтверждении
            $passenger = User::findOrFail($passengerId);
            $passenger->notify(new BookingRequestApproved($order, $passenger->name));

            // Прежде чем вызывать метод joinOrder, убедитесь, что у вас есть все нужные данные
            // Вы можете передавать дополнительные данные в сессию для последующего использования
            $request->session()->put('searchCriteria', [
                'departureCity' => $passengerRequest->departure_city,
                'arrivalCity' => $passengerRequest->arrival_city,
                'seats' => $passengerRequest->seats,
            ]);

            // Подтверждение бронирования
            // Направляем на метод joinOrder, чтобы пассажир добавился к поездке
            return $this->joinOrder($request, $orderId);
        } else {
            // Отклонение бронирования
            $passengerRequest->delete();
            // Отправляем уведомление об отклонении
            $passenger = User::findOrFail($passengerId);
            $passenger->notify(new BookingRequestDenied($order, $passenger->name));
            // Установите сообщение в сессии
            session()->flash('message', 'Запрос на бронирование отклонен.');
            return redirect()->route('order.show', ['order' => $orderId]);
        }
    }*/
    public function respondToBookingRequest(Request $request, $orderId, $passengerId)
    {
        $order = Order::findOrFail($orderId);
        $passengerRequest = $order->passengerRequests()
            ->where('passenger_id', $passengerId)
            ->firstOrFail();

        // Получаем данные из запроса или из заказа
        $departureCity = $request->input('departureCity') ?? $order->fromAddress->city;
        $arrivalCity = $request->input('arrivalCity') ?? $order->toAddress->city;
        $seats = $request->input('seats', 1); // Количество мест из запроса

        Log::info('respondToBookingRequest Data: ', $request->all());

        if ($request->approve) {
            $passengerRequest->approved_at = now(); // Подтверждаем бронирование
            $passengerRequest->save();

            // Логирование
            Log::info("Passenger request approved for order {$orderId} and passenger {$passengerId}");

            // Очищаем и задаем новые значения в сессии
            session()->forget('searchCriteria');
            session(['searchCriteria' => [
                'departureCity' => $departureCity,
                'arrivalCity' => $arrivalCity,
                'seats' => 1,
            ]]);

            // Отправляем уведомление пассажиру
            $passenger = User::findOrFail($passengerId);
            $passenger->notify(new BookingRequestApproved($order, $passenger->name));

            // Добавляем пассажира к заказу через метод joinOrder
            try {
                $request->merge([
                    'passenger_id' => $passengerId, // Добавляем ID пассажира
                    'departure_city' => $departureCity,
                    'arrival_city' => $arrivalCity,
                    'seats' => $seats,
                    'date_time_departure' => $order->date_time_departure // Передаем дату и время поездки
                ]);

                $this->joinOrder($request, $orderId);

                return redirect()->route('order.show', ['order' => $orderId])
                    ->with('message', 'Бронирование подтверждено, пассажир добавлен к поездке.');
            } catch (\Exception $e) {
                Log::error('respondToBookingRequest Ошибка при добавлении пассажира в поездку: ' . $e->getMessage());
                return back()->withErrors('Произошла ошибка при добавлении пассажира к поездке. Попробуйте еще раз.');
            }
        } else {
            // Отклонение бронирования
            $passengerRequest->delete();

            // Логируем отклонение
            Log::info("respondToBookingRequest Запрос пассажира отклонен для заказа {$orderId} и пассажира {$passengerId}");
            $passenger = User::findOrFail($passengerId);

            // Отправляем уведомление об отклонении
            $passenger->notify(new BookingRequestDenied($order, $passenger->name));

            session()->flash('message', 'Запрос на бронирование отклонен.');
            return redirect()->route('order.show', ['order' => $orderId]);
    }
}
    // рабочий метод
   /* public function joinOrder(Request $request, $orderId)
    {
        Log::info("Entering joinOrder method for order {$orderId}");

        $sessionCriteria = session('searchCriteria', []);
        $userId = auth()->id();
        Log::info("Authenticated user ID: {$userId}");

        if (!$userId) {
            Log::warning("User is not authenticated.");
            session()->flash('message', 'Пользователь не аутентифицирован.');
            return redirect()->route('order.show', ['order' => $orderId]);
        }

        $order = Order::find($orderId);
        Log::info("joinOrder Order details: ", ['order' => $order]);

        if (!$order) {
            Log::warning("Order not found for ID: {$orderId}");
            session()->flash('message', 'Поездка не найдена.');
            return redirect()->route('order.show', ['order' => $orderId]);
        }

        if ($order->available_seats <= 0) {
            Log::info("No available seats for order {$orderId}");
            session()->flash('message', 'Нет свободных мест.');
            return redirect()->route('order.show', ['order' => $orderId]);
        }

        $seats = $sessionCriteria['seats'] ?? 1;
        Log::info("joinOrder Requested seats: {$seats}");

        if ($order->available_seats < $seats) {
            Log::info("Not enough available seats for order {$orderId}");
            return back()->withErrors('Недостаточно свободных мест для бронирования.');
        }

        if ($order->driver_id === $userId) {
            // Водитель добавляет пассажира
            $passengerId = $request->passenger_id;
            Log::info("Driver trying to add passenger with ID: {$passengerId}");

            if (!$passengerId) {
                Log::error("Passenger ID not provided in request.");
                return response()->json(['error' => 'ID пассажира не передан.'], 400);
            }

            $exists = DB::table('order_passenger')
                ->where('order_id', $orderId)
                ->where('passenger_id', $passengerId)
                ->exists();
            Log::info("Passenger exists check result: {$exists}");

            if ($exists) {
                Log::info("Passenger already assigned to order {$orderId}");
                session()->flash('message', 'Пассажир уже назначен на этот заказ.');
                return redirect()->route('order.show', ['order' => $orderId]);
            }

            $order->passengers()->attach($passengerId, [
                'departure_city' => $request->departure_city,
                'arrival_city' => $request->arrival_city,
                'seats' => $seats,
                'date_time_departure' => $order->date_time_departure // Передаем дату и время поездки
            ]);

            Log::info("Passenger {$passengerId} attached to order {$orderId}");
            Log::info('Order joinOrder departure date and time: ' . $order->date_time_departure);

        } else {
            // Пользователь добавляется как пассажир
            $exists = DB::table('order_passenger')
                ->where('order_id', $orderId)
                ->where('passenger_id', $userId)
                ->exists();
            Log::info("User exists check result: {$exists}");

            if ($exists) {
                Log::info("User already assigned to order {$orderId}");
                session()->flash('message', 'Пассажир уже назначен на этот заказ.');
                return redirect()->route('order.show', ['order' => $orderId]);
            }

            $order->passengers()->attach($userId, [
                'departure_city' => $request->departure_city,
                'arrival_city' => $request->arrival_city,
                'seats' => $seats,
                'date_time_departure' => $order->date_time_departure // Передаем дату и время поездки


            ]);
            Log::info("joinOrder User {$userId} attached to order {$orderId}");
        }

        // Обновляем количество доступных мест
        $order->available_seats -= $seats;
        $order->save();
        Log::info("joinOrder Order {$orderId} updated with new available seats: {$order->available_seats}");
        Log::info('joinOrder Order departure date and time: ' . $order->date_time_departure);

        // Перенаправляем на страницу заказа
        return redirect()->route('order.show', ['order' => $orderId]);
    }*/

    public function joinOrder(Request $request, $orderId)
    {
        Log::info("Entering joinOrder method for order {$orderId}");

        $sessionCriteria = session('searchCriteria', []);
        $userId = auth()->id();
        Log::info("Authenticated user ID: {$userId}");

        if (!$userId) {
            Log::warning("User is not authenticated.");
            session()->flash('message', 'Пользователь не аутентифицирован.');
            return redirect()->route('order.show', ['order' => $orderId]);
        }

        $order = Order::find($orderId);
        Log::info("joinOrder Order details: ", ['order' => $order]);

        if (!$order) {
            Log::warning("Order not found for ID: {$orderId}");
            session()->flash('message', 'Поездка не найдена.');
            return redirect()->route('order.show', ['order' => $orderId]);
        }

        if ($order->available_seats <= 0) {
            Log::info("No available seats for order {$orderId}");
            session()->flash('message', 'Нет свободных мест.');
            return redirect()->route('order.show', ['order' => $orderId]);
        }

        $seats = $sessionCriteria['seats'] ?? 1;
        Log::info("joinOrder Requested seats: {$seats}");

        if ($order->available_seats < $seats) {
            Log::info("Not enough available seats for order {$orderId}");
            return back()->withErrors('Недостаточно свободных мест для бронирования.');
        }

        if ($order->driver_id === $userId) {
            // Водитель добавляет пассажира
            $passengerId = $request->passenger_id;
            Log::info("Driver trying to add passenger with ID: {$passengerId}");

            if (!$passengerId) {
                Log::error("Passenger ID not provided in request.");
                return response()->json(['error' => 'ID пассажира не передан.'], 400);
            }

            $exists = DB::table('order_passenger')
                ->where('order_id', $orderId)
                ->where('passenger_id', $passengerId)
                ->exists();
            Log::info("Passenger exists check result: {$exists}");

            if ($exists) {
                Log::info("Passenger already assigned to order {$orderId}");
                session()->flash('message', 'Пассажир уже назначен на этот заказ.');
                return redirect()->route('order.show', ['order' => $orderId]);
            }

            $order->passengers()->attach($passengerId, [
                'departure_city' => $request->departure_city,
                'arrival_city' => $request->arrival_city,
                'seats' => $seats,
                'date_time_departure' => $order->date_time_departure
            ]);

            Log::info("Passenger {$passengerId} attached to order {$orderId}");

        } else {
            // Пользователь добавляется как пассажир
            $exists = DB::table('order_passenger')
                ->where('order_id', $orderId)
                ->where('passenger_id', $userId)
                ->exists();
            Log::info("User exists check result: {$exists}");

            if ($exists) {
                Log::info("User already assigned to order {$orderId}");
                session()->flash('message', 'Пассажир уже назначен на этот заказ.');
                return redirect()->route('order.show', ['order' => $orderId]);
            }

            $order->passengers()->attach($userId, [
                'departure_city' => $request->departure_city,
                'arrival_city' => $request->arrival_city,
                'seats' => $seats,
                'date_time_departure' => $order->date_time_departure
            ]);
            Log::info("joinOrder User {$userId} attached to order {$orderId}");

            // Обновляем количество доступных мест
            $order->available_seats -= $seats;
            $order->save();
            Log::info("joinOrder Order {$orderId} updated with new available seats: {$order->available_seats}");
            Log::info('joinOrder Order departure date and time: ' . $order->date_time_departure);
        }

        return redirect()->route('order.show', ['order' => $orderId]);
    }


    public function cancelBookingRequest(Request $request, $orderId)
    {
        // Ваша логика для отмены запроса на бронирование
        // Например, вы можете удалить запись о запросе
        $requestToCancel = PassengerRequest::where('order_id', $orderId)
            ->where('passenger_id', Auth::id())
            ->first();

        if ($requestToCancel) {
            $requestToCancel->delete();
           // return response()->json(['message' => 'Запрос на бронирование отменен.']);
            // Установите сообщение в сессии
            session()->flash('message', 'Запрос на бронирование отменен.');
            return redirect()->route('order.show', ['order' => $orderId]);
        }

        // return response()->json(['message' => 'Запрос не найден.'], 404);
        session()->flash('message', 'Запрос не найден.');
        return redirect()->route('order.show', ['order' => $orderId]);
    }

    // метод для логирования
    protected function logPassengerAction($user, $order, $action)
    {
        Log::info('Passenger ' . $action, [
            'passenger_name' => $user->name,
            'order_id' => $order->id,
            'from_city' => $order->fromAddress->city,
            'to_city' => $order->toAddress->city,
            'date_time_departure' => $order->date_time_departure,
        ]);
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
        // Уведомление через систему уведомлений Laravel
        $driver->notify(new PassengerCancelledOrder(
            $order,
            $request->cancellation_reason,
            $user->name, // Имя водителя
            $order->date_time_departure, // Дата поездки
            $order->fromAddress->city, // Город отправления
            $order->toAddress->city // Город прибытия
        ));
        // Логируем информацию о том, что пассажир отменил бронь
        // Логирование действия
        $this->logPassengerAction($user, $order, 'canceled booking');

        // Удаляем запрос на бронирование из таблицы passenger_requests
        $requestToCancel = PassengerRequest::where('order_id', $orderId)
            ->where('passenger_id', $user->id)
            ->first();

        if ($requestToCancel) {
            $requestToCancel->delete();
        }

        // Уведомление по email
       try {
            Notification::route('mail', $driver->email)
                ->notify(new PassengerCancelledOrder(
                    $order,
                    $user->name, // Имя пассажира
                    $order->fromAddress->city, // Город отправления
                    $order->toAddress->city, // Город прибытия
                    $order->date_time_departure,
                    $request->cancellation_reason,
                ));
            Log::info('Уведомление отправлено водителю на Email: ' . $driver->id);
        } catch (Exception $e) {
            Log::error('Не удалось отправить уведомление водителю на Email: ' . $driver->id . '. Ошибка: ' . $e->getMessage());
        }

        // Логируем успешное завершение отмены
        Log::info("Passenger {$user->name} has cancelled booking for order ID {$orderId}");
        Log::info('cancelOrderPassenger Order departure date and time: ' . $order->date_time_departure);
        // Возвращаем Inertia-ответ
        return redirect()->route('order.show', ['order' => $orderId]);
//            ->with('notification', [
//                'passenger_name' => $user->name,
//                'cancellation_reason' => $request->cancellation_reason,
//                'date_time_departure' => $order->date_time_departure,
//           ]);

    }
  /*  public function cancelOrderPassenger(Request $request, $orderId)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        $order = Order::findOrFail($orderId);

        // Получение даты отправления
        $date_time_departure = $order->date_time_departure;

        // Сохранение даты в сессию
        session(['date_time_departure' => $date_time_departure]);

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

        // Удаляем пассажира из таблицы order_passenger
        $order->passengers()->detach($user->id);

        // Лог перед изменениями в Order
        Log::info('Лог перед изменениями в Order cancelOrderPassenger:', ['order_id' => $orderId, 'date_time_departure' => $date_time_departure]);

        // Обновляем заказ с сохранением исходной даты отправления
        $order->update([
            'available_seats' => $order->available_seats,
            'date_time_departure' => $requestData['date_time_departure'] ?? $order->date_time_departure,
        ]);

        // Уведомляем водителя об отмене
        $driver = $order->driver;
        $driver->notify(new PassengerCancelledOrder(
            $order,
            $request->cancellation_reason,
            $user->name,
            $date_time_departure, // Используем дату поездки, не изменяя её
            $order->fromAddress->city,
            $order->toAddress->city
        ));

        // Удаляем запрос на бронирование
        $requestToCancel = PassengerRequest::where('order_id', $orderId)
            ->where('passenger_id', $user->id)
            ->first();

        if ($requestToCancel) {
            $requestToCancel->delete();
        }

        // Логируем успешное завершение отмены
        Log::info("Passenger {$user->name} has cancelled booking for order ID {$orderId}");
        // Лог после изменениями в Order
        Log::info('Лог после изменения в Order cancelOrderPassenger:', ['order_id' => $orderId, 'date_time_departure' => $date_time_departure]);
        // Возвращаем Inertia-ответ с успешным сообщением
        return redirect()->route('order.show', ['order' => $orderId])
            ->with('success', 'Вы успешно отменили бронирование.');
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

        Log::info('cancelOrderPassenger Order departure date and time: ' . $order->date_time_departure);

        // Перенаправляем пользователя с подтверждением отмены
        return redirect()->route('driver.orders')->with('success', 'Trip has been successfully canceled');
    }
}
