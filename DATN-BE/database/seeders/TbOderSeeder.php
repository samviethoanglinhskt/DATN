<?php

namespace Database\Seeders;
use App\Models\tb_oder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TbOderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        tb_oder::factory(5)->create();
    }
}
