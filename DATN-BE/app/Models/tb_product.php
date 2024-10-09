<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class tb_product extends Model
{
    use HasFactory;

    protected $table;

    protected $fillable = [
        'tb_category_id',
        'tb_brand_id',
        'name',
        'status',
        'description'
    ];

    public function category(){
        return $this->belongsTo(tb_category::class, 'tb_category_id');
    }

    public function brand(){
        return $this->belongsTo(tb_brand::class, 'tb_brand_id');
    }

    public function color(){
        return $this->belongsToMany(tb_color::class, 'tb_variants');
    }

    public function size(){
        return $this->belongsToMany(tb_size::class, 'tb_variants');
    }

    public function account()
    {
        return $this->belongsToMany(tb_account::class, 'tb_comments', 'tb_product_id', 'tb_account_id')
                    ->withPivot('content', 'created_at', 'updated_at');
    }

    public function cart(){
        return $this->belongsTo(tb_cart::class);
    }

}
