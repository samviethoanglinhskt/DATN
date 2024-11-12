<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class tb_new extends Model
{
    use HasFactory;
    protected $table = 'tb_news';
    protected $fillable = [
        'title',
        'content',
        'create_day'
    ];

}
