<?php

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
        Schema::create('tb_discounts', function (Blueprint $table) {
            $table->id();
            $table->string('discount_code');
            $table->integer('discount_value');
            $table->string('name');
            $table->dateTime('start_day');
            $table->dateTime('end_day');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tb_discounts');
    }
};
