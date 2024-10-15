<?php

namespace Database\Seeders;

use App\Models\tb_brand;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BrandsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        tb_brand::factory()->count(10)->create();
    }
}
