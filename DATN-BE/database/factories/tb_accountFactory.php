<?php

namespace Database\Factories;

use App\Models\tb_account;
use Illuminate\Database\Eloquent\Factories\Factory;

class tb_accountFactory extends Factory
{

    public function definition()
    {
        return [
            'tb_role_id' => '1', // Giả sử có từ 1 đến 4 vai trò
            'user_name' => fake()->name(),
            'password' => fake()->password(), // Mật khẩu mặc định
            'phone' => fake()->phoneNumber(),
            'email' => fake()->email(),
        ];
    }
}

