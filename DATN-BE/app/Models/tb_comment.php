<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class tb_comment extends Model
{
    use HasFactory;

    protected $table;

    protected $fillable = [
        'tb_account_id',
        'tb_product_id',
        'content',
        'post_date',
    ];

    protected $attributes = [];

    public function __construct(array $attributes = []){
        parent::__construct($attributes);
        $this->attributes['post_date'] = Carbon::now();
    }
}
