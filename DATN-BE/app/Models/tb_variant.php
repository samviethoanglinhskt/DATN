<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class tb_variant extends Model
{
    use HasFactory;

    protected $table;

    protected $fillable = [
        'tb_product_id',
        'sku',
        'name',
        'price',
        'color',
        'image',
        'quantity',
        'status'
    ];

    public function product(){
        return $this->belongsTo(tb_product::class);
    }

    public function cart(){
        return $this->belongsTo(tb_cart::class);
    }
}
