<?php

use App\Models\tb_oder;
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
        Schema::create('tb_oderdetails', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(tb_oder::class)->constrained();
            $table->foreignIdFor(tb_product::class)->constrained();
            $table->integer('quantity');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tb_oderdetails');
    }
};
