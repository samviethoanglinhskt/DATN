<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class tb_image extends Model
{
    use HasFactory;

    protected $table;

    protected $fillable = [
        'tb_variant_id',
        'name_image',
        'status'
    ];

    public function variant(){
        return $this->belongsTo(tb_variant::class);
    }
}
