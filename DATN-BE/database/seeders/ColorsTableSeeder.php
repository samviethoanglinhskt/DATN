<?php

namespace Database\Seeders;

use App\Models\tb_color;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ColorsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        tb_color::factory()->count(10)->create();
    }
}
