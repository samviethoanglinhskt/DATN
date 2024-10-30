<?php

namespace App\Http\Controllers;

use App\Models\tb_image;
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
    public function index() {}
    public function getListProduct()
    {

        try {
            $products = tb_product::with('variants.images', 'colors', 'sizes')->get(); // lấy sản phẩm, biến thể, thương hiệu, danh mục

            return response()->json([
                'success' => true,
                'data' => $products
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Đã xảy ra lỗi!',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getLatestProduct()  // lấy sản phẩm mới nhất
    {
        try {

            $product = tb_product::with('variants.images', 'colors', 'sizes')
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
    public function store(Request $request) // thêm sản phẩm,biến thể, ảnh sản phẩm
    {
        try {

            $product = tb_product::query()->create($request->all());

            // tạo thằng product xong thì thêm luôn biến thể k lỗi
            $data = [];
            foreach ($request->variants ?? [] as $variant) {
                $new_variant = tb_variant::query()->create([
                    'tb_product_id' => $product->id,
                    'tb_size_id' => $variant['tb_size_id'],
                    'tb_color_id' => $variant['tb_color_id'],
                    'sku' => $variant['sku'],
                    'price' => $variant['price'],
                    'quantity' => $variant['quantity'],
                    'status' => $variant['status'],
                ]);
                $variant_data = [
                    'variant' => $new_variant,
                    'image' => []
                ];

                // thêm biến thể thì thêm luôn ảnh sản phẩm
                if (!empty($new_variant)) {
                    foreach ($variant['images'] as $image) {
                        $tb_image = tb_image::query()->create([
                            'tb_variant_id' => $new_variant->id,
                            'name_image' => $image['name_image'],
                            'status' => $image['status'],
                        ]);
                        $variant_data[]['image'] = $tb_image;

                    }
                }
                $data[] = $variant_data;
            }
            return response()->json([
                'message' => 'Tạo sản phẩm thành công',
                'product' => $product,
                'variant' => $data
            ], 201);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    public function update(Request $request, string $id)
    {
        try {
            // Tìm sản phẩm
            $product = tb_product::findOrFail($id);

            // Cập nhật thông tin sản phẩm
            $product->update([
                'tb_category_id' => $request->tb_category_id,
                'tb_brand_id' => $request->tb_brand_id,
                'name' => $request->name,
                'status' => $request->status,
                'description' => $request->description
            ]);

            // Lấy tất cả biến thể hiện có của sản phẩm
            $existingVariants = tb_variant::where('tb_product_id', $product->id)->get();
            // hứng dữ liệu
            $data = [];
            // hứng id đã có để sửa
            $existingVariantIds = [];

            // Lặp qua từng biến thể trong request
            foreach ($request->variants as $variantData) {
                if (isset($variantData['id'])) {
                    // Nếu biến thể có ID cũ, sửa biến thể
                    $variant = tb_variant::findOrFail($variantData['id']);
                    $variant->update([
                        'tb_color_id' => $variantData['tb_color_id'],
                        'tb_size_id' => $variantData['tb_size_id'],
                        'sku' => $variantData['sku'],
                        'price' => $variantData['price'],
                        'quantity' => $variantData['quantity'],
                        'status' => $variantData['status']
                    ]);
                    $new_data = [
                        'vartiant' => $variant,
                        'image' => [],
                    ];
                    $existingVariantIds[] = $variant->id; // Lưu ID của biến thể đã cập nhật
                } else {
                    // Nếu không có ID, thêm mới biến thể
                    $variant = tb_variant::create([
                        'tb_product_id' => $product->id,
                        'tb_color_id' => $variantData['tb_color_id'],
                        'tb_size_id' => $variantData['tb_size_id'],
                        'sku' => $variantData['sku'],
                        'price' => $variantData['price'],
                        'quantity' => $variantData['quantity'],
                        'status' => $variantData['status']
                    ]);
                    $new_data = [
                        'vartiant' => $variant,
                        'image' => [],
                    ];
                }

                // Xử lý ảnh biến thể
                if (isset($variantData['images'])) {
                    foreach ($variantData['images'] as $imageData) {
                        if (isset($imageData['id'])) {
                            // Nếu ảnh có ID cũ, sửa ảnh
                            $image = tb_image::findOrFail($imageData['id']);
                            $image->update([
                                'name_image' => $imageData['name_image'],
                                'status' => $imageData['status']
                            ]);
                            $new_data[]['image'] = $image;
                        } else {
                            // Nếu ảnh không có ID, thêm mới ảnh
                            $image = $variant->images()->create([
                                'name_image' => $imageData['name_image'],
                                'status' => $imageData['status']
                            ]);
                            $new_data[]['image'] = $image;
                        }
                    }
                }

                // Đẩy biến thể đã cập nhật/thêm vào mảng kết quả
                $data[] = $new_data;
            }

            // Xóa những biến thể không còn trong request
            foreach ($existingVariants as $existingVariant) {
                if (!in_array($existingVariant->id, $existingVariantIds)) {
                    // Xóa biến thể nếu nó không có trong request
                    $existingVariant->delete();
                }
            }

            return response()->json([
                'product' => $product,
                'variants' => $data
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Sản phẩm hoặc biến thể không tồn tại'], 404);
        } catch (Exception $e) {
            return response()->json(['error' => 'Không thể cập nhật sản phẩm'], 500);
        }
    }



    /**
     * Display the specified resource.
     */
    public function show(string $id) // hiển thị sản phẩm theo id
    {
        try {
            $product = tb_product::with('category', 'brand', 'variants.images', 'colors', 'sizes')->findOrFail($id);
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
        try {
            $product = tb_product::with('category', 'brand', 'variants.images', 'colors', 'sizes')->findOrFail($id);
            return response()->json($product);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Sản phẩm không tồn tại'], 404);
        } catch (Exception $e) {
            return response()->json(['error' => 'Không thể lấy sản phẩm'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $product = tb_product::findOrFail($id);
            $product->delete();

            return response()->json(['message' => 'Sản phẩm đã được xóa thành công'], 204);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Sản phẩm không tồn tại'], 404);
        } catch (Exception $e) {
            return response()->json(['error' => 'Lỗi xóa sản phẩm'], 500);
        }
    }
}
