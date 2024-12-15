<?php

namespace App\Http\Controllers;

use App\Models\tb_image;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ImagesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index() // hiển thị list ảnh sản phẩm
    {
        try {
            $image = tb_image::orderBy('id', 'desc')->get();

            return response()->json([
                'success' => true,
                'data' => $image
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Đã xảy ra lỗi!',
                'error' => $e->getMessage()
            ], 500);
        }
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
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id) // xóa ảnh biến thể sản phẩm
    {
        try {
            $image = tb_image::findOrFail($id);

            if ($image->name_image) {
                Storage::disk('public')->delete($image->name_image);
            }

            $image->delete();

            return response()->json(['message' => 'Biến thể đã được xóa thành công'], 204);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Biến thể không tồn tại'], 404);
        } catch (Exception $e) {
            return response()->json(['error' => 'Lỗi xóa biến thể'], 500);
        }
    }
}
