<?php

use App\Models\tb_oder;
use App\Models\tb_product;
use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tb_reviews', function (Blueprint $table) {
            $table->id(); // Khóa chính tự tăng
            $table->foreignIdFor(User::class)->constrained()->onDelete('cascade'); // Liên kết đến bảng users
            $table->foreignIdFor(tb_product::class)->constrained()->onDelete('cascade'); // Liên kết đến bảng products
            $table->foreignId('order_id')->constrained('tb_oders')->onDelete('cascade'); // Liên kết đến bảng tb_oder
            $table->integer('rating')->unsigned(); // Đánh giá (1-5)
            $table->text('comment')->nullable(); // Nội dung bình luận
            $table->timestamps(); // Thời gian tạo và cập nhật
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tb_reviews');
    }
};
