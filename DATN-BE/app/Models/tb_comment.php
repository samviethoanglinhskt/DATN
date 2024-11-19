<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class tb_comment extends Model
{
    use HasFactory;

    protected $table = 'tb_comments';

    protected $fillable = [
        'user_id',
        'tb_product_id',
        'content',
        'rating',
        'parent_id',
        'post_date',
    ];
   

    protected $attributes = [];

    public function __construct(array $attributes = []){
        parent::__construct($attributes);
        $this->attributes['post_date'] = Carbon::now();
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function product()
    {
        return $this->belongsTo(tb_product::class, 'tb_product_id');
    }
    public function parent()
    {
        return $this->belongsTo(tb_comment::class, 'parent_id');
    }
    public function replies()
    {
        return $this->hasMany(tb_comment::class, 'parent_id');
    }
}
