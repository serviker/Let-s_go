<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Street extends Model
{
    use HasFactory;

    protected $table = 'streets'; // Убедитесь, что это правильное имя таблицы
    protected $fillable = ['street'];

    public function city()
    {
        return $this->belongsTo(City::class);
    }
}
