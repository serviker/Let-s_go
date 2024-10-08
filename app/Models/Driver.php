<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Driver extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'drivers';
    protected $guarded = [];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

   /* public function driver()
    {
        return $this->belongsTo(User::class, 'driver_id');
    }*/
}
