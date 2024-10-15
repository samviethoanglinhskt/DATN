<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class tb_cart extends Model
{
    use HasFactory;

    protected $table;

    protected $fillable = [
        'tb_user_id',
        'tb_variant_id',
        'tb_product_id',
        'quantity'
    ];

    public function products(){
        return $this->hasMany(tb_product::class);
    }

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function variants(){
        return $this->hasMany(tb_variant::class);
    }

    public function oder(){
        return $this->hasOne(tb_oder::class);
    }
}
