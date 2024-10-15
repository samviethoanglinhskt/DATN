<?php

namespace Database\Seeders;

use App\Models\tb_product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        tb_product::factory()->count(10)->create();
    }
}
