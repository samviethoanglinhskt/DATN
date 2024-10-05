<?php

namespace Database\Seeders;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TbBrandSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('tb_brands')->insert([
            ['name' => 'Dior'],
            ['name' => 'Gucci'],
            ['name' => 'Chanel'],
            ['name' => 'LV']
        ]);
    }
}
