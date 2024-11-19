<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Favorite extends Model
{
    use HasFactory;
  
    protected $table = 'favorites';

    protected $fillable = ['user_id', 'tb_product_id'];
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function product()
    {
        return $this->belongsTo(tb_product::class,'tb_product_id');
    }
}
