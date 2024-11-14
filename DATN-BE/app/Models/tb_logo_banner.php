<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class tb_logo_banner extends Model
{
    use HasFactory;
    protected $table = 'tb_logo_banner';
    protected $fillable = [
        'name',
        'image',
        'created_at'
    ];
}
