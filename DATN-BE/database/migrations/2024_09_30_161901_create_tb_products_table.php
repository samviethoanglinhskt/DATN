<?php

use App\Models\tb_brand;
use App\Models\tb_category;
use App\Models\tb_comment;
use App\Models\tb_discount;
use App\Models\tb_variant;
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
        Schema::create('tb_products', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(tb_category::class)->constrained();
            $table->foreignIdFor(tb_brand::class)->constrained();
            $table->string('name')->unique();
            $table->decimal('price');
            $table->string('imgae');
            $table->string('status');
            $table->text('description');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tb_products');
    }
};
