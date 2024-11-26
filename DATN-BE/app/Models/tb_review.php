<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class tb_review extends Model
{
    use HasFactory;
    protected $table = 'tb_reviews';
    protected $fillable = [
        'user_id',
        'tb_product_id',
        'order_id',
        'rating',
        'comment'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function product()
    {
        return $this->belongsTo(tb_product::class, 'tb_product_id');
    }
    public function order()
    {
        return $this->belongsTo(tb_oder::class, 'order_id');
    }
}
