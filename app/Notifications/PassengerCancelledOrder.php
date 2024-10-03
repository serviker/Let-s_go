<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class PassengerCancelledOrder extends Notification
{
    protected $order;
    protected $name;
    protected $fromCity;
    protected $toCity;
    protected $date_time_departure;
    protected $cancellation_reason;

    public function __construct($order, $cancellation_reason, $name, $date_time_departure, $fromCity, $toCity)
    {
        $this->order = $order;
        $this->cancellation_reason = $cancellation_reason;
        $this->name = $name;
        $this->date_time_departure = $date_time_departure;
        $this->fromCity = $fromCity;
        $this->toCity = $toCity;
    }

    public function toArray($notifiable)
    {
        return [
            '$name' => $this->name,
            'date_time_departure' => str_replace(' ', 'T', $this->date_time_departure),
            'fromCity' => $this->fromCity,
            'toCity' => $this->toCity,
            'cancellation_reason' => $this->cancellation_reason,
        ];
    }

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    // Определите данные уведомления
    public function toDatabase($notifiable)
    {
        return [
            'order_id' => $this->order->id,
            'name' => $this->name,
            'date_time_departure' => str_replace(' ', 'T', $this->date_time_departure),
            'fromCity' => $this->fromCity,
            'toCity' => $this->toCity,
            'cancellation_reason' => $this->cancellation_reason,
            'message' => 'Ваша бронь в заказе #' . $this->order->id . ' была отменена.',
        ];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Пассажир отменил бронирование')
            ->line("Пассажир {$this->name} отменил свое бронирование.")
            ->line("Маршрут: {$this->fromCity} в {$this->toCity}")
            ->line("Дата бронирования: {$this->order->date_time_departure}")
            ->line("Причина отмены: {$this->cancellation_reason }")
            ->action('Посмотреть поездки', url("/orders/{$this->order->id}"));
    }
}

