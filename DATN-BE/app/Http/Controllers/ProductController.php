<?php

namespace App\Http\Controllers;

use App\Models\tb_product;
use App\Models\tb_variant;
use Exception;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(){

    }
     public function getListProduct()
    {
        // try {
        //     $products = tb_product::with('color', 'size', 'category', 'brand')->get(); // lấy sản phẩm, biến thể, thương hiệu, danh mục

        //     return response()->json([
        //         'success' => true,
        //         'data' => $products
        //     ], 200);
        // } catch (\Exception $e) {
        //     return response()->json([
        //         'success' => false,
        //         'message' => 'Đã xảy ra lỗi!',
        //         'error' => $e->getMessage()
        //     ], 500);
        // }
    }

    public function getLatestProduct()  // lấy sản phẩm mới nhất
    {
        try {

            $product = tb_product::with('color', 'size', 'category', 'brand')
                ->orderBy('id', 'desc')
                ->limit(5)
                ->get();

            // Nếu không tìm thấy sản phẩm
            if (!$product) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy sản phẩm.'
                ], 404);
            }

            // Trả về sản phẩm mới nhất
            return response()->json([
                'success' => true,
                'data' => $product
            ], 200);
        } catch (\Exception $e) {
            // Trả về lỗi nếu có
            return response()->json([
                'success' => false,
                'message' => 'Đã xảy ra lỗi!',
                'error' => $e->getMessage()
            ], 500);
        }
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
        // DB::beginTransaction(); // Sử dụng transaction để đảm bảo tính toàn vẹn dữ liệu

        // try {
        //     // Tạo sản phẩm với các trường cụ thể từ request
        //     $product = tb_product::create($request->all());

        //     // Kiểm tra và tạo biến thể nếu có dữ liệu variant được gửi kèm
        //     if ($request->has('variant')) {
        //         $variantData = $request->variant;
        //         $variantData['tb_product_id'] = $product->id; // Gắn product_id từ sản phẩm vừa tạo
        //         tb_variant::create($variantData); // Tạo variant tương ứng
        //     }

        //     // Tải lại sản phẩm kèm theo thông tin của category, brand, và variant (nếu có)
        //     $product->load('category', 'brand', 'variant');

        //     DB::commit(); // Hoàn tất transaction

        //     return response()->json($product, 201); // Trả về sản phẩm vừa được tạo
        // } catch (Exception $e) {
        //     DB::rollBack(); // Rollback nếu có lỗi xảy ra
        //     return response()->json(['error' => 'Không thể tạo sản phẩm', 'message' => $e->getMessage()], 500);
        // }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id) // hiển thị sản phẩm theo id
    {
        try {
            $product = tb_product::with(['category', 'brand', 'variant'])->findOrFail($id);
            return response()->json($product);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Sản phẩm không tồn tại'], 404);
        } catch (Exception $e) {
            return response()->json(['error' => 'Không thể lấy sản phẩm'], 500);
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
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // try {
        //     $product = tb_product::query()->findOrFail($id);

        //     // Xóa tất cả các biến thể liên quan
        //     $product->variant()->delete(); // Quan hệ variants() cần được khai báo trong model Product

        //     // Xóa sản phẩm
        //     $product->delete();

        //     return response()->json(null, 204);
        // } catch (ModelNotFoundException $e) {
        //     return response()->json(['error' => 'Sản phẩm không tồn tại'], 404);
        // } catch (Exception $e) {
        //     return response()->json(['error' => 'Lỗi xóa sản phẩm'], 500);
        // }
    }
}
