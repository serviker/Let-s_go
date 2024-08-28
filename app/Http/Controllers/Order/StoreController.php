<?php

namespace App\Http\Controllers\Order;

use App\Http\Controllers\Controller;
use App\Http\Requests\Order\StoreRequest;
use App\Models\Address;
use App\Models\OrderIntermediateAddress;
use Illuminate\Support\Facades\Log;

use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class StoreController extends Controller
{
    public function __invoke(StoreRequest $request): RedirectResponse
    {
        $data = $request->validated();

       // Log::info('Data Received:', $data);

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
        if (!empty($data['intermediate_addresses'])) { // Имя поля должно совпадать
            foreach ($data['intermediate_addresses'] as $city) {
                // Дебаг: Проверьте, что промежуточные адреса приходят с клиента
               // Log::info('!!!!! Intermediate Addresses:', ['intermediate_addresses' => $data['intermediate_addresses']]);

                // Проверяем или создаем запись в таблице `addresses`
                $intermediateAddress = Address::firstOrCreate([
                    'city' => $city,
                ]);

                // Сохраняем ID промежуточного адреса
                $intermediateAddresses[] = $intermediateAddress->id;
               // Log::info('Intermediate Address created or found:', ['address' => $intermediateAddress]);
            }
        }

        // Дебаг: Проверьте, что промежуточные адреса созданы
       // Log::info('Received Intermediate Addresses:', ['intermediate_addresses' => $data['intermediate_addresses'] ?? []]);

        try {
            $order = Order::create([
                'user_id' => Auth::id(),
                'date_time_departure' => $data['date_time_departure'] . ' ' . $data['departure_time'],
                'from_address_id' => $fromAddress->id,
                'to_address_id' => $toAddress->id,
                'price' => $data['price'],
                'available_seats' => $data['available_seats'],
                'description' => $data['description'],
            ]);

            // Привязка промежуточных адресов
            if (!empty($intermediateAddresses)) {
                // Дебаг: Проверьте, что промежуточные адреса действительно привязываются
              /*  Log::info('Attaching Intermediate Addresses to Order:', [
                    'order_id' => $order->id,
                    'intermediate_addresses' => $intermediateAddresses
                ]);*/
                $order->intermediateAddresses()->attach($intermediateAddresses);
            }

            return redirect()->route('order.show', $order->id)
                ->with('success', 'Заказ успешно создан!');
               // ->with('intermediate_addresses', $intermediateAddresses);
        } catch (\Exception $e) {
          //  Log::error('Failed to create order', ['error' => $e->getMessage(), 'data' => $data]);
            return redirect()->back()->with('error', 'Ошибка создания заказа');
        }
    }

}
