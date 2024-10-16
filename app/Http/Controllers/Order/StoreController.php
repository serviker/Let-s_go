<?php

namespace App\Http\Controllers\Order;

use App\Http\Controllers\Controller;
use App\Http\Requests\Order\StoreRequest;
use App\Models\Address;
use App\Models\Driver;
use App\Models\OrderIntermediateAddress;
use App\Models\StatusOrder;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class StoreController extends Controller
{
    public function __invoke(StoreRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $userId = Auth::id();

        // Проверка или создание начального адреса
        $fromAddress = Address::firstOrCreate([
            'city' => $data['from_city'],
            'street' => $data['from_street'],
            'house' => $data['from_house'],
        ]);

        // Проверка или создание конечного адреса
        $toAddress = Address::firstOrCreate([
            'city' => $data['to_city'],
            'street' => $data['to_street'],
            'house' => $data['to_house'],
        ]);

        // Проверка или создание промежуточных адресов
        $intermediateAddresses = [];
        if (!empty($data['intermediate_addresses'])) {
            foreach ($data['intermediate_addresses'] as $city) {
                $intermediateAddress = Address::firstOrCreate([
                    'city' => $city,
                ]);
                $intermediateAddresses[] = $intermediateAddress->id;
            }
        }

        // Проверка или создание записи в таблице drivers для этого пользователя
        $driver = Driver::firstOrCreate(['user_id' => $userId], ['created_at' => now()]);

        // Логируем информацию о создании водителя
        Log::info('Driver creation check', [
            'driver_exists' => Driver::where('user_id', $userId)->exists(),
            'driver_id' => $driver->id,
            'user_id' => $userId,
        ]);

        try {
            // Создание даты и времени отправления
            $dateTimeDeparture = Carbon::createFromFormat('Y-m-d H:i', $data['date_time_departure'] . ' ' . $data['departure_time']);

            // Создание заказа
            $order = Order::create([
                'user_id' => $userId,
                'driver_id' => $driver->id, // Устанавливаем driver_id на ID записи в таблице drivers
                'date_time_departure' => $dateTimeDeparture,
                'from_address_id' => $fromAddress->id,
                'to_address_id' => $toAddress->id,
                'price' => $data['price'],
                'available_seats' => $data['available_seats'],
                'description' => $data['description'],
                'status_order_id' => $data['status_order_id'], // Добавляем статус напрямую
            ]);

            // Логика перенаправления
            $driver = Driver::find($order->driver_id); // Найти запись водителя
            Log::info('User redirect logic', [
                'is_driver' => $driver && $driver->user_id === $userId, // Проверяем, совпадает ли user_id водителя с аутентифицированным пользователем
                'driver_id' => $driver ? $driver->id : null,
                'auth_user_id' => $userId,
            ]);

            // Привязка промежуточных адресов
            if (!empty($intermediateAddresses)) {
                $order->intermediateAddresses()->attach($intermediateAddresses);
            }

            return redirect()->route('order.show', $order->id)
                ->with('success', 'Заказ успешно создан!')
                ->with(['preserveScroll' => true]);

        } catch (\Exception $e) {
            Log::error('Failed to create order', ['error' => $e->getMessage(), 'data' => $data]);
            return redirect()->back()->with('error', 'Ошибка создания заказа');
        }
    }
}
