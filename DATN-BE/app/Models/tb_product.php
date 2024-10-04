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
        'price',
        'image',
        'status',
        'description'
    ];

    public function category(){
        return $this->belongsTo(tb_category::class, 'tb_category_id');
    }

    public function brand(){
        return $this->belongsTo(tb_brand::class, 'tb_brand_id');
    }

    public function variant(){
        return $this->hasOne(tb_variant::class);
    }

    public function account()
    {
        return $this->belongsToMany(tb_account::class, 'tb_comments', 'tb_product_id', 'tb_account_id')
                    ->withPivot('content', 'created_at', 'updated_at');
    }

}
