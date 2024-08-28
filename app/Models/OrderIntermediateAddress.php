<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class OrderIntermediateAddress extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'order_intermediate_address';
    protected $guarded = [];

    protected $fillable = ['order_id', 'intermediate_address_id'];

   /* public function orders()
    {
        return $this->belongsToMany(Order::class, 'order_intermediate_address');
    }*/
}
