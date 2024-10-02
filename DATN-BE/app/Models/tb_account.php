<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class tb_account extends Model
{
    use HasFactory;

    protected $table;

    protected $fillable = [
        'tb_role_id',
        'user_name',
        'password',
        'phone',
        'email',
    ];

    public function role(){
        return $this->belongsTo(tb_role::class);
    }

    public function oder(){
        return $this->hasOne(tb_oder::class);
    }

    public function product()
{
    return $this->belongsToMany(tb_product::class, 'tb_comments', 'tb_account_id', 'tb_product_id')
                ->withPivot('content', 'created_at', 'updated_at');
}

}
