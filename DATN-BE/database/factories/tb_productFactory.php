<?php

namespace Database\Factories;
use App\Models\tb_category;
use App\Models\tb_brand;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\tb_product>
 */
class tb_productFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'tb_category_id' => tb_category::inRandomOrder()->first()->id, // Lấy ngẫu nhiên ID từ tb_categories
            'tb_brand_id' => tb_brand::inRandomOrder()->first()->id, // Lấy ngẫu nhiên ID từ tb_brand
            'name' => fake()->name(),
            'status'=> $this->faker->randomElement(array: ['Còn', 'Hết', 'Đang Cập Nhật']),
            'description'=>fake()->text(50)
        ];
    }
}
