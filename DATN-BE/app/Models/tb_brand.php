<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class tb_brand extends Model
{
    use HasFactory;

    protected $table;

    protected $fillable = [
        'name'
    ];

    public function products(){
        return $this->hasMany(tb_product::class);
    }
}
