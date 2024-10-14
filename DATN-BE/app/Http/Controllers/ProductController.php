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
            $products = tb_product::with('variants', 'variants.images', 'colors', 'sizes')->get(); // lấy sản phẩm, biến thể, thương hiệu, danh mục

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

            $product = tb_product::with('variants.color', 'variants.size', 'category', 'brand')
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
                $data_variants = [
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
                    }
                    $data_variants[]['image'] = $tb_image;
                }
                $data[] = $data_variants;
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
    public function update(Request $request, string $id) // sửa sản phẩm,biến thể, ảnh biến thể
    {
        try {
            // tìm sản phẩm
            $product = tb_product::query()->findOrFail($id);
            // sửa sản phẩm
            $product->update([
                'tb_category_id' => $request->tb_category_id,
                'tb_brand_id' => $request->tb_brand_id,
                'name' => $request->name,
                'status' => $request->status,
                'description' => $request->description
            ]);
            // sửa biến thể theo id của sản phẩm
            $variant = tb_variant::query()->where('tb_product_id', $product->id)->get();

            $data = [];
            // nếu có biến thể thì sửa
            if ($variant) {
                foreach ($variant as $id => $updateVariant) {
                    $updateVariant->update([
                        'tb_color_id' => $request->variants[$id]['tb_color_id'],
                        'tb_size_id' => $request->variants[$id]['tb_size_id'],
                        'sku' => $request->variants[$id]['sku'],
                        'price' => $request->variants[$id]['price'],
                        'quantity' => $request->variants[$id]['quantity'],
                        'status' => $request->variants[$id]['status']
                    ]);
                    // nếu có ảnh thì sửa ảnh
                    if ($updateVariant->images) {
                        foreach ($updateVariant->images as $idIamge => $updateImage) {
                            $updateImage->update([
                                'name_image' => $request->variants[$id]['images'][$idIamge]['name_image'],
                                'status' => $request->variants[$id]['images'][$idIamge]['status']
                            ]);
                        }
                    }
                    // hứng dữ liệu vứt ra json
                    $data[] = $updateVariant;
                }
            }
            return response()->json([
                'product' => $product,
                'variant' => $data
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Sản phẩm không tồn tại'], 404);
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
            $product = tb_product::with('variants.color', 'variants.size', 'category', 'brand')->findOrFail($id);
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
            $product = tb_product::with('variants', 'colors', 'sizes', 'category', 'brand')->findOrFail($id);
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
