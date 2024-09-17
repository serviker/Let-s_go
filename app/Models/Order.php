<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'orders';

    protected $dates = ['date_time_departure'];

    protected $fillable = [
        'user_id',
        'driver_id',
        'date_time_departure',
        'passenger_id',
        'from_address_id',
        'to_address_id',
        'price',
        'available_seats',
        'description',
    ];

    // --------------------------------------------------------------------------------------------------------------------//
    // проверить на коректность названий методов intermediateAddresses или intermediate_addresses как правильно !!!!
    // --------------------------------------------------------------------------------------------------------------------//

    public function intermediateAddresses(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Address::class, 'order_intermediate_address', 'order_id', 'intermediate_address_id');
    }


    public function fromAddress(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Address::class, 'from_address_id');
    }

    public function toAddress(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Address::class, 'to_address_id');
    }

    public function driver()
    {
        return $this->belongsTo(User::class, 'driver_id');
    }

    public function passengers()
    {
        return $this->belongsToMany(User::class, 'order_passenger', 'order_id', 'passenger_id');
    }

    public function statusOrder()
    {
        return $this->belongsTo(StatusOrder::class, 'status_order_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // App\Models\Order.php
    public function messages()
    {
        return $this->hasMany(Message::class);
    }

}

