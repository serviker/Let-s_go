<?php

namespace App\Http\Controllers\Message;

use App\Http\Controllers\Controller;
use App\Http\Requests\Address\StoreRequest;
use App\Models\Address;
use App\Models\Message;
use App\Models\Order;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class StoreController extends Controller
{
    public function __invoke(StoreRequest $request, $orderId) {
        // Валидация данных
        $data = $request->validate([
            'sender_id' => 'required|exists:users,id',
            'recipient_id' => 'required|exists:users,id',
            'message_text' => 'required|string',
        ]);

        // Создаем новое сообщение
        $message = Message::create([
            'sender_id' => $data['sender_id'],
            'recipient_id' => $data['recipient_id'],
            'order_id' => $orderId,
            'message_text' => $data['message_text'],
        ]);

        // Получаем обновленные сообщения для текущего диалога
        $messages = Message::where('order_id', $orderId)
            ->where(function ($query) use ($data) {
                $query->where(function ($q) use ($data) {
                    $q->where('sender_id', $data['sender_id'])
                        ->where('recipient_id', $data['recipient_id']);
                })->orWhere(function ($q) use ($data) {
                    $q->where('sender_id', $data['recipient_id'])
                        ->where('recipient_id', $data['sender_id']);
                });
            })->get();

        return response()->json([
            'message' => $message,
            'messages' => $messages, // Возвращаем обновленный список сообщений
        ]);
    }

}
