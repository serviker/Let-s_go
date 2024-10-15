<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderPassenger extends Model
{
    use HasFactory;

    // Укажите имя таблицы явно
    protected $table = 'order_passenger';

    // Укажите, какие поля можно массово заполнять
    protected $fillable = [
        'order_id',
        'passenger_id',
        'departure_city',
        'arrival_city',
        'seats',
        'date_time_departure',
    ];

    // Определение связи с моделью Order
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    // Определение связи с моделью User (пассажир)
    public function passenger()
    {
        return $this->belongsTo(User::class, 'passenger_id');
    }
}
