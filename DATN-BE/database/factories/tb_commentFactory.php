<?php

namespace Database\Factories;
use App\Models\tb_account;
use App\Models\tb_product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\tb_comment>
 */
class tb_commentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'tb_account_id' => tb_account::inRandomOrder()->first()->id, // Lấy ngẫu nhiên ID từ tài khoản
            'tb_product_id' => tb_product::inRandomOrder()->first()->id, // Lấy ngẫu nhiên ID từ sản phẩm
            'content' => fake()->text(50),
            'post_date' => fake()->dateTime()
        ];
    }
}
