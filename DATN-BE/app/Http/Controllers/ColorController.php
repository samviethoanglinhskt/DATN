<?php

namespace App\Http\Controllers;

use App\Models\tb_color;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class ColorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $color = tb_color::orderBy('id', 'desc')->get(); 
        return response()->json($color);
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
        $color = tb_color::query()->create($request->all());
        try {
            return response()->json([
                'message' => 'Tạo mới màu thành công',
                'data' => $color
            ]);
        } catch (Exception $e) {
            return response()->json(['error' => 'Không thể tạo màu'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
        try {
            $color = tb_color::query()->findOrFail($id);
            return response()->json([
                'message' => 'Dung tích ' . $id,
                'data' => $color
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Màu không tồn tại'], 404);
        } catch (Exception $e) {
            return response()->json(['error' => 'Không thể lấy màu'], 500);
        }
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
        //
        try {
            $color = tb_color::query()->findOrFail($id);

            $color->update([
                'name' => $request->name,
            ]);

            return response()->json([
                'message' => 'Sửa thành công',
                'data' => $color
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Màu không tồn tại'], 404);
        } catch (Exception $e) {
            return response()->json(['error' => 'Không thể cập nhật màu'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        try {
            $color = tb_color::findOrFail($id);
            $color->delete();

            return response()->json([
                'message' => 'Xóa thành công',
                'data' => null
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Màu không tồn tại'], 404);
        } catch (Exception $e) {
            return response()->json(['error' => 'Không thể xóa màu'], 500);
        }
    }
}
