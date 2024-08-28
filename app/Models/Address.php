<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Address extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'addresses';
    protected $guarded = [];
    protected $fillable = ['city', 'street', 'house'];

    public function orders()
    {
        return $this->belongsToMany(Order::class, 'order_intermediate_address', 'intermediate_address_id', 'order_id');
    }
}
