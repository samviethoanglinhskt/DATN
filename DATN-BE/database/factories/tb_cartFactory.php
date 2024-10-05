<?php

namespace Database\Factories;
use App\Models\tb_account;
use App\Models\tb_variant;
use App\Models\tb_product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\tb_cart>
 */
class tb_cartFactory extends Factory
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
            'tb_variant_id' => tb_variant::inRandomOrder()->first()->id, // Lấy ngẫu nhiên ID từ biến thể
            'tb_product_id' => tb_product::inRandomOrder()->first()->id, // Lấy ngẫu nhiên ID từ danh mục
            'quantity' =>rand(1,10), // randum số lượng từ 1 đến 10
        ];
    }
}
