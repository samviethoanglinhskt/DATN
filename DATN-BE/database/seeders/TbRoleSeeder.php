<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TbRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('tb_roles')->insert([
            ['name' => 'admin'],
            ['name' => 'user'],
            ['name' => 'khách'],
            ['name' => 'nhân viên']
        ]);
    }
}
