<?php

use App\Models\tb_product;
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
        Schema::create('tb_variants', function (Blueprint $table) {
            $table->id();
            $table->string('sku');
            $table->string('name');
            $table->decimal('price');
            $table->string('color');
            $table->string('image');
            $table->integer(column: 'quantity');
            $table->string('status');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tb_variants');
    }
};
