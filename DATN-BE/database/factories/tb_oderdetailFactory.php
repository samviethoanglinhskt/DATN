<?php

namespace Database\Factories;
use App\Models\tb_product;
use App\Models\tb_oder;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\tb_oderdetail>
 */
class tb_oderdetailFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'tb_oder_id' => tb_oder::inRandomOrder()->first()->id, // Lấy ngẫu nhiên ID từ đơn hàng
            'tb_product_id' => tb_product::inRandomOrder()->first()->id, // Lấy ngẫu nhiên ID từ danh mục
            'quantity' =>rand(1,10), // randum số lượng từ 1 đến 10
        ];
    }
}
