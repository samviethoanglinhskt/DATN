<?php

namespace App\Http\Controllers;

use App\Models\tb_category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $category = tb_category::all(); //lấy danh mục
        return response()->json($category);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // $category = tb_category::query()-> where('id',$id)->first();
        // if (!$category){
        //     $res=[
        //         'status'=> false,
        //         'message'=>'Khong co sinh vien nay',
        //     ];
        //     return response()->json($res,404);
        // }
        // $category ->update([
        //     'name' => $request->ten,
        //     'major_id' => $request->maNganh,
        //     'email' => $request->email,
        //     'dob' => $request->ngaySinh,
        // ]);
        // $res=[
        //     'status'=> true,
        //     'message'=>'Chi tiet sinh vien',
        //     'data'=> new StudentResoure($category)
        // ];
        // return response()->json($res,200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
