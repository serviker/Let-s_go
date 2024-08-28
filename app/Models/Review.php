<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Review extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'reviews';
    protected $guarded = [];

    protected $fillable = [
        'sender_id',
        'review_type_id',
        'recipient_id',
        'order_id',
        'rating',
        'comment',
    ];

    // Определение атрибута для удобного доступа к времени создания отзыва
    public function getDateTimeReviewAttribute()
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

    public function review_type()
    {
        return $this->belongsTo(ReviewType::class, 'review_type_id');
    }

    public function from_address()
    {
        return $this->belongsTo(Address::class, 'from_address_id');
    }

    public function to_address()
    {
        return $this->belongsTo(Address::class, 'to_address_id');
    }
    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id');
    }
}
