<?php

use App\Models\tb_role;
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
        Schema::create('tb_accounts', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(tb_role::class)->constrained();
            $table->string('user_name');
            $table->string('password');
            $table->integer(column: 'phone');
            $table->string('email');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tb_accounts');
    }
};
