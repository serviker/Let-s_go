<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderCancelled extends Notification
{
    use Queueable;

    protected $order;
    protected $cancellationReason;

    public function __construct($order, $cancellationReason)
    {
        $this->order = $order;
        $this->cancellationReason = $cancellationReason;
    }

    public function via($notifiable)
    {
       // return ['mail', 'database']; // Уведомление по email и сохранение в базе
        return ['database']; // Уведомление при сохранение в базе
    }

    // Определите данные уведомления
    public function toDatabase($notifiable)
    {
        return [
            'order_id' => $this->order->id,
            'cancellation_reason' => $this->cancellationReason,
            'message' => 'Ваш заказ #' . $this->order->id . ' был отменен.',
        ];
    }

   /* public function toMail($notifiable)
    {
        return (new MailMessage) // Создаем новый объект MailMessage
        ->subject('Order Cancelled') // Устанавливаем тему письма
        ->line('Поездка из ' . $this->order->fromCity . ' в ' . $this->order->toCity . ' был отменена.') // Основной текст сообщения, включая информацию о заказе
        ->line('Причина отмены: ' . $this->cancellationReason) // Указываем причину отмены
        ->action('Посмотреть заказы', url('/orders')) // Создаем кнопку для перехода к заказам с заданным URL
        ->line('Спасибо за использование нашего приложения!'); // Завершающее сообщение
    }

    public function toArray($notifiable)
    {
        return [
            'order_id' => $this->order->id,
            'cancellation_reason' => $this->cancellationReason,
        ];
    }*/
}

