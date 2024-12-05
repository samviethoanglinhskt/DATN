<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TbOderdetailTemp extends Model
{
    use HasFactory;
    protected $table = "tb_oderdetail_temp";
    protected $fillable = [
        'tb_oder_temp_id',
        'tb_product_id',
        'tb_variant_id',
        'quantity',
        'price',
        'is_reviewed',
    ];
    public function oderTemp()
    {
        return $this->belongsTo(TbOderTemp::class, 'tb_oder_temp_id');
    }

    public function productTemp()
    {
        return $this->belongsTo(tb_product::class, 'tb_product_id');
    }

    public function variantTemp()
    {
        return $this->belongsTo(tb_variant::class, 'tb_variant_id');
    }
}
