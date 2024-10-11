<?php

namespace Database\Seeders;

use App\Models\tb_size;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SizesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        tb_size::factory()->count(10)->create();
    }
}
