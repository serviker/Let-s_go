<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Bus\Queueable;

class BookingRequestNotification extends Notification
{
    use Queueable;

    protected $order;
    protected $passengerName;

    public function __construct($order, $passengerName)
    {
        $this->order = $order;
        $this->passengerName = $passengerName;
    }

    public function via($notifiable)
    {
        return ['database', 'mail'];
    }

    public function toArray($notifiable)
    {
        return [
            'order_id' => $this->order->id,
            'message' => 'Новый запрос на бронирование от пассажира ' . $this->passengerName,
        ];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Новый запрос на бронирование')
            ->line('Вы получили новый запрос на бронирование от ' . $this->passengerName)
            ->action('Просмотреть запрос', url("/driver/{$this->order->driver_id}/booking-requests"));
    }
}

