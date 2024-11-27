<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class tb_address_user extends Model
{
    use HasFactory;

    protected $table = 'tb_address_users';
    protected $fillable = [
        'user_id',
        'address',
        'address_detail'
    ];

    public function user(){
        return $this->belongsTo(User::class, 'user_id');
    }
}
