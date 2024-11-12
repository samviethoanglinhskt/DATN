<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class tb_cart extends Model
{
    use HasFactory;

    protected $table;

    protected $fillable = [
        'user_id',
        'tb_product_id',
        'quantity',
        'tb_variant_id',
    ];

    public function products(){
        return $this->belongsTo(tb_product::class, 'tb_product_id');
    }
    public function variant()
    {
        return $this->belongsTo(tb_variant::class, 'tb_variant_id');
    }

    /**
     * Relationship with Size model
     */
    public function user(){
        return $this->belongsTo(User::class, 'user_id');
    }

    // public function oder(){
    //     return $this->hasOne(tb_oder::class);
    // }
}
