<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class tb_cart extends Model
{
    use HasFactory;

    protected $table;

    protected $fillable = [
        'tb_account_id',
        'tb_variant_id',
        'tb_product_id',
        'quantity'
    ];

    public function product(){
        return $this->hasMany(tb_product::class);
    }

    public function account(){
        return $this->hasOne(tb_account::class);
    }

    public function variant(){
        return $this->hasMany(tb_variant::class);
    }

    public function oder(){
        return $this->hasOne(tb_oder::class);
    }
}
