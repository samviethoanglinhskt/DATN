<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class FavoriteController extends Controller
{
    public function index(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $favorites = Favorite::with('product', 'product.variants', 'product.variants.images')
            ->where('user_id', $user->id)->get();

        return response()->json($favorites);
    }
    public function store(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            if (!$user) {
                return response()->json(['message' => 'Người dùng không tồn tại']);
            }
            $request->validate([
                'tb_product_id' => 'required|exists:tb_products,id',
            ]);

            $favorite = Favorite::firstOrCreate([
                'user_id' => $user->id,
                'tb_product_id' => $request->tb_product_id,
            ]);
            return response()->json(['message' => 'Sản phẩm đã được thêm vào danh sách yêu thích', 'favorite' => $favorite]);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra, vui lòng thử lại sau.',
                'error' => $th->getMessage(),
            ], 500);
        }
    }
    public function destroy($id)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            $favorite = Favorite::where('id', $id)->where('user_id', $user->id)->first();

            if ($favorite) {
                $favorite->delete();
                return response()->json(['message' => 'Đã xóa sản phẩm khỏi danh sách yêu thích']);
            } else {
                return response()->json(['message' => 'Sản phẩm không tồn tại trong danh sách yêu thích'], 404);
            }
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra, vui lòng thử lại sau.',
                'error' => $th->getMessage(),
            ], 500);
        }
    }
}
