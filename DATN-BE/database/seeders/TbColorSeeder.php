<?php

namespace Database\Seeders;

use App\Models\tb_color;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TbColorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        tb_color::factory(5)->create();
    }
}
