<?php

namespace App\Http\Controllers;

use App\Models\tb_brand;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class BrandController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $brand = tb_brand::all(); //lấy thương hiệu
        return response()->json($brand);
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
        $category = tb_brand::query()->create($request->all());
        try {
            return response()->json([
                'message' => 'Tạo mới thương hiệu thành công',
                'data' => $category
            ]);
        } catch (Exception $e) {
            return response()->json(['error' => 'Không thể tạo thương hiệu'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $category = tb_brand::query()->findOrFail($id);
            return response()->json([
                'message' => 'Thương hiệu ' . $id,
                'data' => $category
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Thương hiệu không tồn tại'], 404);
        } catch (Exception $e) {
            return response()->json(['error' => 'Không thể lấy thương hiệu'], 500);
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
        try {
            $category = tb_brand::query()->findOrFail($id);

            $category->update([
                'name' => $request->name,
            ]);

            return response()->json([
                'message' => 'Sửa thành công',
                'data' => $category
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Thương hiệu không tồn tại'], 404);
        } catch (Exception $e) {
            return response()->json(['error' => 'Không thể cập nhật Thương hiệu'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $category = tb_brand::findOrFail($id);
            $category->delete();

            return response()->json([
                'message' => 'Xóa thành công',
                'data' => null
            ], 204);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Thương hiệu không tồn tại'], 404);
        } catch (Exception $e) {
            return response()->json(['error' => 'Không thể xóa thương hiệu'], 500);
        }
    }
}
