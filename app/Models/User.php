<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes;
    protected $table = 'users';
    protected $guarded = [];
    protected $fillable = [
        'name',
        'lastName',
        'email',
        'phone',
        'photoUrl',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    // Определение атрибута для удобного доступа к дате регистрации
    public function getRegistrationDateAttribute()
    {
        return $this->created_at;
    }
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    public function cars(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Car::class);
    }

    public function driver()
    {
        return $this->hasOne(Driver::class);
    }

    public function passenger()
    {
        return $this->hasOne(Passenger::class);
    }
}
