<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class tb_color extends Model
{
    use HasFactory;

    protected $table = 'tb_colors';

    protected $fillable = [
        'name'
    ];

    public function variants(){
        return $this->hasMany(tb_variant::class);
    }
}
