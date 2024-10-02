<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class tb_role extends Model
{
    use HasFactory;

    protected $table;

    protected $fillable = [
        'name'
    ];

    public function account(){
        return $this->hasMany(tb_account::class);
    }
}
