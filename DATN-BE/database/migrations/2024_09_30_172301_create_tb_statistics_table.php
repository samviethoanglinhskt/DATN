<?php

use App\Models\tb_category;
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
        Schema::create('tb_statistics', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(tb_category::class)->constrained();
            $table->date('date');
            $table->string('statistic_value');
            $table->string('unit');
            $table->string('status');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tb_statistics');
    }
};
