<?php

namespace App\Notifications;

use AllowDynamicProperties;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

#[AllowDynamicProperties] class DriverCancelledOrder extends Notification
{
    use Queueable;

    protected $order;
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
            'name' => $this->name,
            'date_time_departure' => str_replace(' ', 'T', $this->date_time_departure),
            'fromCity' => $this->fromCity,
            'toCity' => $this->toCity,
            'cancellation_reason' => $this->cancellation_reason,
        ];
    }


    public function via($notifiable)
    {
        return ['mail', 'database']; // Уведомление по email и сохранение в базе
        //  return ['database']; // Уведомление при сохранение в базе
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
            'message' => 'Ваш заказ #' . $this->order->id . ' был отменен.',
        ];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage) // Создаем новый объект MailMessage
        ->subject('Order Cancelled') // Устанавливаем тему письма
        ->line('Поездка из ' . $this->order->fromCity . ' в ' . $this->order->toCity . ' был отменена.') // Основной текст сообщения, включая информацию о заказе
        ->line('Причина отмены: ' . $this->cancellation_reason) // Указываем причину отмены
        ->action('Посмотреть заказы', url('/orders')) // Создаем кнопку для перехода к заказам с заданным URL
        ->line('Спасибо за использование нашего приложения!'); // Завершающее сообщение
    }
}

