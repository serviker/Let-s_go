<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OptionValue extends Model
{
    use HasFactory;

    protected $fillable = ['option_id', 'description'];

    // Связь с таблицей options
    public function option()
    {
        return $this->belongsTo(Option::class);
    }

    // Связь с таблицей user_options (пользователи, выбравшие это значение)
    public function users()
    {
        return $this->belongsToMany(User::class, 'user_options', 'option_value_id', 'user_id');
    }
}
