<?php

use App\Models\tb_color;
use App\Models\tb_product;
use App\Models\tb_size;
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
            $table->foreignIdFor(tb_product::class)->constrained();
            $table->foreignIdFor(tb_color::class)->constrained();
            $table->foreignIdFor(tb_size::class)->constrained();
            $table->string('sku');
            $table->decimal('price');
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
