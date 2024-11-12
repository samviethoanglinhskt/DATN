<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class tb_oder extends Model
{
    use HasFactory;

    protected $table;

    protected $fillable = [
        'order_code',
        'user_id',
        'tb_discount_id',
        'order_date',
        'total_amount',
        'order_status',
        'name',
        'phone',
        'address',
        'email'
    ];

    // public function cart(){
    //     return $this->belongsTo(tb_cart::class, 'tb_cart_id');
    // }

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function discount(){
        return $this->belongsTo(tb_discount::class);
    }

    public function oderDetails(){
        return $this->hasMany(tb_oderdetail::class);
    }
}
