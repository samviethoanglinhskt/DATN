<?php

namespace App\Http\Controllers;

use App\Models\tb_image;
use App\Models\tb_product;
use App\Models\tb_variant;
use Exception;
use GuzzleHttp\Psr7\UploadedFile;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;


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
    public function store(Request $request)
    {
        try {
            if ($request->hasFile('image') && $request->file('image')->isValid()) {
                $imagePr = $request->file('image')->store('products', 'public');
            } else {
                return response()->json(['error' => 'Lỗi ảnh sản phẩm'], 400);
            }
            $product = tb_product::query()->create([
                'tb_category_id' => $request->tb_category_id,
                'tb_brand_id' => $request->tb_brand_id,
                'name' => $request->name,
                'status' => $request->status,
                'description' => $request->description,
                'image' => $imagePr,
            ]);

            $data = [];
            foreach ($request->variants ?? [] as $variant) {
                $new_variant = tb_variant::query()->create([
                    'tb_product_id' => $product->id,
                    'tb_size_id' => $variant['tb_size_id'] ?? null,
                    'tb_color_id' => $variant['tb_color_id'] ?? null,
                    'sku' => $variant['sku'],
                    'price' => $variant['price'],
                    'quantity' => $variant['quantity'],
                    'status' => $variant['status'],
                ]);
                $variant_data = [
                    'variant' => $new_variant,
                    'tb_image' => []
                ];

                if (!empty($variant['images'])) {
                    foreach ($variant['images'] as $image) {

                        // Sử dụng request->file() để lấy file
                        if (isset($image['name_image']) && $image['name_image']->isValid()) {
                            // Lưu ảnh vào storage và lấy đường dẫn
                            $path = $image['name_image']->store('images', 'public');
                            // return response()->json($path);
                            // Lưu thông tin ảnh vào CSDL
                            $tb_image = tb_image::query()->create([
                                'tb_variant_id' => $new_variant->id,
                                'name_image' => $path,

                            ]);
                            $variant_data['tb_image'][] = $tb_image;
                        } else {
                            return response()->json(['error' => 'lỗi ảnh biến thể'], 400);
                        }
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
            // tìm sản phẩm
            $product = tb_product::findOrFail($id);

            if ($request->file('image') && $request->file('image')->isValid()) {
                // Xóa ảnh cũ nếu có
                if ($product->image) {
                    Storage::disk('public')->delete($product->image);
                }
                // Lưu ảnh mới
                $imagePr = $request->file('image')->store('products', 'public');
            } else {
                $imagePr = $product->image;
            }
            $product->update(array_filter([
                'tb_category_id' => $request->tb_category_id ?? null,
                'tb_brand_id' => $request->tb_brand_id ?? null,
                'name' => $request->name ?? null,
                'status' => $request->status ?? null,
                'description' => $request->description ?? null,
                'image' => $imagePr ?? $product->image,
            ]));
            // return response()->json($product);
            if ($request->variants && is_array($request->variants)) {
                foreach ($request->variants as $id => $variantData) {
                    if (isset($product->variants[$id])) {
                        // Cập nhật biến thể nếu tồn tại
                        $variant = $product->variants[$id];
                        $variant->update(array_filter([
                            'tb_size_id' => $variantData['tb_size_id'] ?? null,
                            'tb_color_id' => $variantData['tb_color_id'] ?? null,
                            'sku' => $variantData['sku'] ?? null,
                            'price' => $variantData['price'] ?? null,
                            'quantity' => $variantData['quantity'] ?? null,
                            'status' => $variantData['status'] ?? null,
                        ]));
                        if (isset($variantData['images']) && is_array($variantData['images'])) {
                            foreach ($variant->images as $id_image => $variantImage) {
                                if (isset($variantData['images'][$id_image]['name_image']) && $variantData['images'][$id_image]['name_image']->isValid()) {
                                    // Xóa ảnh cũ nếu có
                                    if ($variantImage->name_image) {
                                        Storage::disk('public')->delete($variantImage->name_image);
                                    }
                                    // Lưu ảnh mới
                                    $newImagePath = $variantData['images'][$id_image]['name_image']->store('images', 'public');
                                    // Cập nhật đường dẫn ảnh mới và các thông tin khác
                                    $variantImage->update([
                                        'name_image' => $newImagePath,
                                    ]);
                                }
                            }
                        }
                    } else {
                        $variant = $product->variants()->create([
                            'tb_product_id' => $product->id,
                            'tb_size_id' => $variantData['tb_size_id'],
                            'tb_color_id' => $variantData['tb_color_id'],
                            'sku' => $variantData['sku'],
                            'price' => $variantData['price'],
                            'quantity' => $variantData['quantity'],
                            'status' => $variantData['status']
                        ]);
                        // Thêm ảnh cho biến thể mới nếu có
                        if (isset($variantData['images']) && is_array($variantData['images'])) {
                            foreach ($variantData['images'] as $imageData) {
                                if (isset($imageData['name_image']) && $imageData['name_image']->isValid()) {
                                    // Lưu ảnh mới
                                    $newImagePath = $imageData['name_image']->store('images', 'public');

                                    // Thêm ảnh mới vào biến thể
                                    $variant->images()->create([
                                        'name_image' => $newImagePath,
                                    ]);
                                }
                            }
                        }
                    }
                }
            }
            // Load lại các quan hệ để trả về đầy đủ dữ liệu mới cập nhật
            $product->load('variants.images');
            return response()->json([
                'product' => $product,
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
            $product = tb_product::with('variants.images')->findOrFail($id);

            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            foreach ($product->variants as $variant) {
                foreach ($variant->images as $variantImage) {
                    if ($variantImage->name_image) {
                        Storage::disk('public')->delete($variantImage->name_image);
                    }
                }
            }
            $product->delete();

            return response()->json(['message' => 'Sản phẩm đã được xóa thành công'], 204);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Sản phẩm không tồn tại'], 404);
        } catch (Exception $e) {
            return response()->json(['error' => 'Lỗi xóa sản phẩm'], 500);
        }
    }
}
