<?php

use App\Models\tb_account;
use App\Models\tb_cart;
use App\Models\tb_discount;
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
            $table->foreignIdFor(tb_account::class)->constrained();
            $table->foreignIdFor(tb_discount::class)->constrained();
            $table->date('order_date');
            $table->decimal('total_amount');
            $table->string('oder_status');
            $table->string('name');
            $table->integer('phone');
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
