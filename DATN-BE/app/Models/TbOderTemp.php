<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TbOderTemp extends Model
{
    use HasFactory;
    protected $table = 'tb_oder_temps';
    protected $fillable = [
        'order_code',
        'user_id',
        'tb_discount_id',
        'order_date',
        'total_amount',
        'order_status',
        'order_type',
        'feedback',
        'name',
        'phone',
        'address',
        'email'
    ];
    public function userTemp()
    {
        return $this->belongsTo(User::class);
    }

    public function discountTemp()
    {
        return $this->belongsTo(tb_discount::class, 'tb_discount_id', 'id');
    }

    public function oderDetailsTemp()
    {
        return $this->hasMany(TbOderdetailTemp::class, 'tb_oder_temp_id');
    }
}
