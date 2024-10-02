<?php

namespace Database\Factories;
use App\Models\tb_product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\tb_variant>
 */
class tb_variantFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'tb_product_id' => tb_product::inRandomOrder()->first()->id, // Lấy ngẫu nhiên ID từ danh mục
            'sku' => $this->faker->regexify('[A-Z0-9]{8}'), // Tạo chuỗi ngẫu nhiên gồm 8 ký tự bao gồm chữ cái viết hoa và số.
            'name' => fake()->name(),
            'price' => $this->faker->randomFloat(2, 1000, 10000),
            'color' => fake()->colorName(),
            'image' => '',
            'quantity' =>rand(1,10), // randum số lượng từ 1 đến 10
            'status'=> $this->faker->randomElement(array: ['Còn', 'Hết', 'Đang Cập Nhật']),
            
        ];
    }
}
