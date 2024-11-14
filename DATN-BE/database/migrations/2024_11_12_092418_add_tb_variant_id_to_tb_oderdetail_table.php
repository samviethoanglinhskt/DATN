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
        Schema::table('tb__oderdetail', function (Blueprint $table) {
            $table->unsignedBigInteger('tb_variant_id')->after('tb_product_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tb__oderdetail', function (Blueprint $table) {
            //
        });
    }
};
