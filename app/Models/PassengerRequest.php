<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PassengerRequest extends Model
{
    use HasFactory;

    protected $fillable = ['order_id', 'passenger_id', 'approved_at', 'message', 'departure_city', 'arrival_city', 'seats'];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function passenger()
    {
        return $this->belongsTo(User::class, 'passenger_id');
    }
}
