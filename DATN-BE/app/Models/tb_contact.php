<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class tb_contact extends Model
{
    use HasFactory;
    protected $table = 'tb_contacts';

    protected $fillable = [
        'user_id', 
        'name', 
        'phone', 
        'email', 
        'content', 
        'status'
    ];

    public function user()
    {
        return $this->belongsTo(User::class); 
    }

}
