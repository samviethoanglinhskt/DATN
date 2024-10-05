<?php

namespace Database\Factories;
use App\Models\tb_account;
use App\Models\tb_cart;
use App\Models\tb_discount;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\tb_oder>
 */
class tb_oderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'tb_cart_id' => tb_cart::inRandomOrder()->first()->id, // Lấy ngẫu nhiên ID từ giỏ hàng
            'tb_account_id' => tb_account::inRandomOrder()->first()->id, // Lấy ngẫu nhiên ID từ tài khoản
            'tb_discount_id' => tb_discount::inRandomOrder()->first()->id, // Lấy ngẫu nhiên ID từ tài khoản
            'order_date' => fake()->date(),
            'total_amount' => $this->faker->randomFloat(2, 1000, 10000),
            'oder_status'=> $this->faker->randomElement(array: ['Đã Xác Nhận', 'Đang Vận Chuyển', 'Đã Nhận']),
            'name' => fake()->name(),
            'phone' => fake()->phoneNumber(),
            'address'=> fake()->address(),
            'email' => fake()->email()
        ];
    }
}
