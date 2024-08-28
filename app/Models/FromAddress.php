<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FromAddress extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'from_addresses';
    protected $guarded = [];
}
