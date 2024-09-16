<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Message extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'messages';
    protected $guarded = [];

    protected $fillable = [
        'sender_id',
        'recipient_id',
        'message_text',
        'order_id',
    ];

    // Определение атрибута для удобного доступа к времени отправки
    public function getDateTimeSendingAttribute()
    {
        return $this->created_at;
    }

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function recipient()
    {
        return $this->belongsTo(User::class, 'recipient_id');
    }
    // App\Models\Message.php
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

}
