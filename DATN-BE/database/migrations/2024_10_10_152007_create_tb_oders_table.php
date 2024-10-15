<?php

use App\Models\tb_cart;
use App\Models\tb_discount;
use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tb_oders', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(tb_cart::class)->constrained();
            $table->foreignIdFor(User::class)->constrained();
            $table->foreignIdFor(tb_discount::class)->constrained();
            $table->date('order_date');
            $table->integer('total_amount');
            $table->string('order_status');
            $table->string('name');
            $table->string('phone');
            $table->string('address');
            $table->string('email');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tb_oders');
    }
};
