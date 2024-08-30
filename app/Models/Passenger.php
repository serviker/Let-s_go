<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Passenger extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'passengers';
    protected $guarded = [];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function passenger()
    {
        return $this->belongsTo(User::class, 'passenger_id');
    }
}
