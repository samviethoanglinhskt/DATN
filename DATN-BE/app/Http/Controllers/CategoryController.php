<?php

namespace App\Http\Controllers;

use App\Http\Requests\API\Categor\StoreCategoryRequest;
use App\Models\tb_category;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $category = tb_category::with('products', 'products.variants.images', 'products.sizes', 'products.colors')->get(); //lấy danh mục
        return response()->json($category);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create() {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request) // add danh muc
    {
        $category = tb_category::query()->create($request->all());
        try {
            return response()->json([
                'message' => 'Tạo mới người dùng thành công',
                'data' => $category
            ]);
        } catch (Exception $e) {
            return response()->json(['error' => 'Không thể tạo danh mục'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id) // hiển thị danh mục theo id
    {
        try {
            $category = tb_category::query()->findOrFail($id);
            return response()->json([
                'message' => 'Danh mục ' . $id,
                'data' => $category
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Danh mục không tồn tại'], 404);
        } catch (Exception $e) {
            return response()->json(['error' => 'Không thể lấy danh mục'], 500);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id) {}

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id) // sửa danh mục
    {
        try {
            $category = tb_category::query()->findOrFail($id);

            $category->update([
                'name' => $request->name,
            ]);

            return response()->json([
                'message' => 'Sửa thành công',
                'data' => $category
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Danh mục không tồn tại'], 404);
        } catch (Exception $e) {
            return response()->json(['error' => 'Không thể cập nhật danh mục'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id) // xóa danh mục
    {
        try {
            $category = tb_category::findOrFail($id);
            $category->delete();

            return response()->json([
                'message' => 'Xóa thành công',
                'data' => null
            ], 204);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Danh mục không tồn tại'], 404);
        } catch (Exception $e) {
            return response()->json(['error' => 'Không thể xóa danh mục'], 500);
        }
    }
}
