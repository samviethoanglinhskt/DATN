<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class tb_variant extends Model
{
    use HasFactory;

    protected $table = 'tb_variants';

    protected $fillable = [
        'tb_size_id',
        'tb_color_id',
        'tb_product_id',
        'sku',
        'price',
        'quantity',
        'status'
    ];

    public function images()
    {
        return $this->hasMany(tb_image::class);
    }
    public function product()
    {
        return $this->belongsTo(tb_product::class);
    }
    public function color()
    {
        return $this->belongsTo(tb_color::class);
    }

    // Một biến thể có một dung tích
    public function size()
    {
        return $this->belongsTo(tb_size::class);
    }
}
