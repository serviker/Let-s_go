<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ToAddress extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'to_addresses';
    protected $guarded = [];
}
