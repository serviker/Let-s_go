<?php

namespace App\Notifications;

use AllowDynamicProperties;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

#[AllowDynamicProperties]
class BookingRequestDenied extends Notification
{
    use Queueable;

    protected $order;
    protected $passengerName;

    public function __construct($order, $passengerName)
    {
        $this->order = $order;
        $this->passengerName = $passengerName;
    }

    public function toArray($notifiable)
    {
        return [
            'order_id' => $this->order->id,
            'passenger_name' => $this->passengerName,
            'message' => 'Ваш запрос на бронирование был отклонен.',
        ];
    }

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Ваш запрос на бронирование отклонен')
            ->line('К сожалению, ваш запрос на бронирование был отклонен.')
            ->line('Поездка: ' . $this->order->fromCity . ' в ' . $this->order->toCity)
            ->line('Дата поездки: ' . $this->order->date_time_departure)
            ->action('Посмотреть заказ', url("/orders/{$this->order->id}"))
            ->line('Спасибо за использование нашего приложения!');
    }
}

