<?php

namespace Database\Seeders;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TbCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('tb_categories')->insert([
            ['name' => 'Son'],
            ['name' => 'Phấn'],
            ['name' => 'Nước Hoa'],
            ['name' => 'Nước Tẩy Trang']
        ]);
    }
}
