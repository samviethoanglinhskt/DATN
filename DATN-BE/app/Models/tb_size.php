<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class tb_size extends Model
{
    use HasFactory;

    protected $table;

    protected $fillable = [
        'name'
    ];

    public function product(){
        return $this->belongsToMany(tb_product::class, 'tb_variant');
    }
}
