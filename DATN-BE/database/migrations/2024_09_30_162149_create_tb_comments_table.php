<?php

use App\Models\tb_account;
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
        Schema::create('tb_comments', function (Blueprint $table) {
            $table->foreignIdFor(tb_account::class)->constrained()->onDelete('cascade');
            $table->foreignIdFor(tb_product::class)->constrained()->onDelete('cascade');
            $table->primary(['tb_account_id', 'tb_product_id']); //khóa chính tổng hợp
            $table->text('content');
            $table->dateTime('post_date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tb_comments');
    }
};
