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
        Schema::table('tb_comments', function (Blueprint $table) {
            $table->unsignedTinyInteger('rating')->after('content');
            $table->unsignedBigInteger('parent_id')->nullable()->after('rating');

          
            $table->foreign('parent_id')->references('id')->on('tb_comments')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tb_comments', function (Blueprint $table) {
            //
        });
    }
};
