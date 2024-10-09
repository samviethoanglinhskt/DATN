<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TbImageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i = 1; $i <= 5; $i++) {
            DB::table('tb_images')->insert([
                ['tb_variant_id' => $i ,'name_image' => 'https://picsum.photos/', 'status'=> '1']
            ]);
        }
    }
}
