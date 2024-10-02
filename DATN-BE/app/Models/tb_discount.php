<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class tb_discount extends Model
{
    use HasFactory;

    protected $table;

    protected $fillable = [
        'discount_code',
        'discount_value	',
        'name',
        'start_day',
        'end_day'
    ];

    public function oder(){
        return $this->hasOne(tb_oder::class);
    }
}
