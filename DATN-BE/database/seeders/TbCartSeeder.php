<?php

namespace Database\Seeders;
use App\Models\tb_cart;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TbCartSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        tb_cart::factory(5)->create();
    }
}
