<?php

namespace Database\Seeders;
use App\Models\tb_oderdetail;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TbOderdetailSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        tb_oderdetail::factory(5)->create();
    }
}
