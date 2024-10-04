<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Option extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description'];

    // Связь с таблицей option_values (значения для каждой опции)
    public function values()
    {
        return $this->hasMany(OptionValue::class);
    }
}
