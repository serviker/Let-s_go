<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class City extends Model
{
    use HasFactory;

    protected $table = 'cities'; // Убедитесь, что это правильное имя таблицы
    protected $fillable = ['city', 'region'];
}
