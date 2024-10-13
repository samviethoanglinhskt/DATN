<?php

namespace Database\Seeders;

use App\Models\tb_image;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ImagesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        tb_image::create([
            'tb_variant_id' => '29',
            'name_image' => fake()->image(),
            'status' => 'active',
        ]);
    }
}
