<?php

namespace App\Http\Controllers;

use App\Models\tb_product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = tb_product::with('variant')->get(); //lấy sản phẩm và biến thể
        return response()->json($products);
    }
    
    public function getLatestProduct()  // lấy sản phẩm mới nhất
    {
        try {
            $product = tb_product::orderBy('id', 'desc')->limit(5)->get();

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
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
