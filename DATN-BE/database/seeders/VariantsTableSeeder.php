<?php

namespace Database\Seeders;

use App\Models\tb_variant;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class VariantsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        tb_variant::factory()->count(10)->create();
    }
}
