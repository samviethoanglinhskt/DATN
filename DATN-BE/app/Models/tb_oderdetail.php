<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class tb_oderdetail extends Model
{
    use HasFactory;

    protected $table = "tb__oderdetail";

    protected $fillable =  [
        'tb_oder_id',
        'tb_product_id',
        'tb_variant_id',
        'quantity',
        'price'
    ];

    public function oder()
    {
        return $this->belongsTo(tb_oder::class, 'tb_oder_id');
    }

    public function product()
    {
        return $this->belongsTo(tb_product::class, 'tb_product_id');
    }

    public function variant()
    {
        return $this->belongsTo(tb_variant::class, 'tb_variant_id');
    }
}
