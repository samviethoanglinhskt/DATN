<?php

namespace Database\Seeders;
use App\Models\tb_comment;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TbCommentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        tb_comment::factory(10)->create();
    }
}
