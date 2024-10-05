<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\tb_discount>
 */
class tb_discountFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'discount_code' => $this->faker->regexify('[A-Z0-9]{8}'), // Tạo chuỗi ngẫu nhiên gồm 8 ký tự bao gồm chữ cái viết hoa và số.
            'discount_value' => $this->faker->numberBetween(5, 50), // Giảm giá từ 5% đến 50%
            'name' => fake()->name(),
            'start_day' => fake()->dateTime(),
            'end_day' => fake()->dateTime(),
        ];
    }
}
