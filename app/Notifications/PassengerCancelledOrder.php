<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class PassengerCancelledOrder extends Notification
{
    protected $order;
    protected $passengerName;
    protected $seats;
    protected $fromCity;
    protected $toCity;
    protected $date_time_departure;
    protected $cancellation_reason;

    public function __construct($order, $passengerName, $seats, $fromCity, $toCity, $date_time_departure, $cancellation_reason)
    {
        $this->order = $order;
        $this->passengerName = $passengerName;
        $this->seats = $seats;
        $this->fromCity = $fromCity;
        $this->toCity = $toCity;
        $this->date_time_departure = $date_time_departure;
        $this->cancellation_reason = $cancellation_reason;
    }

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Пассажир отменил бронирование')
            ->line("Пассажир {$this->passengerName} отменил свое бронирование.")
            ->line("Забронированых мест: {$this->seats}")
            ->line("Маршрут: {$this->fromCity} в {$this->toCity}")
            ->line("Дата бронирования: {$this->order->date_time_departure}")
            ->line("Причина отмены: {$this->cancellation_reason }")
            ->action('Посмотреть поездки', url("/orders/{$this->order->id}"));
    }

    public function toArray($notifiable)
    {
        return [
            'order_id' => $this->order->id,
            'passengerName' => $this->passengerName,
            'seats' => $this->seats,
            'fromCity' => $this->fromCity,
            'toCity' => $this->toCity,
            'date_time_departure' => str_replace(' ', 'T', $this->date_time_departure),
            'cancellation_reason' => $this->cancellation_reason,
        ];
    }

}

