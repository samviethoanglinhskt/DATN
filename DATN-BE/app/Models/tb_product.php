<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class tb_product extends Model
{
    use HasFactory;

    protected $table = 'tb_products';

    protected $fillable = [
        'tb_category_id',
        'tb_brand_id',
        'name',
        'status',
        'description'
    ];

    public function category()
    {
        return $this->belongsTo(tb_category::class);
    }

    public function variants()
    {
        return $this->hasMany(tb_variant::class);
    }

    public function brand()
    {
        return $this->belongsTo(tb_brand::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'tb_comments', 'tb_product_id', 'tb_account_id')
            ->withPivot('content', 'created_at', 'updated_at');
    }
       public function colors()
    {
        return $this->belongsToMany(tb_color::class,'tb_variants');
    }

    // Một biến thể có một dung tích
    public function sizes()
    {
        return $this->belongsToMany(tb_size::class,'tb_variants');
    }

    public function cart()
    {
        return $this->belongsTo(tb_cart::class);
    }
}
