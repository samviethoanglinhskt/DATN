<?php

namespace App\Http\Controllers;

use App\Models\tb_cart;
use App\Models\tb_product;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class CartController extends Controller
{
    public function addToCart(Request $request)
    {
        $request->validate([
            'tb_product_id' => 'required|exists:tb_products,id',
            'quantity' => 'required|integer|min:1',
        ]);
        try {
            $user = JWTAuth::parseToken()->authenticate();
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Người dùng không tồn tại',
                ], 404);
            }

            $product = tb_product::findOrFail($request->tb_product_id);
            // Thêm sản phẩm vào giỏ hàng
            $cart = tb_cart::firstOrCreate(
                ['user_id' => $user->id, 'tb_product_id' => $product->id],
                ['quantity' => 0]
            );

            // Cập nhật số lượng
            $cart->quantity += $request->quantity;
            $cart->save();

            return response()->json([
                'success' => true,
                'message' => 'Sản phẩm đã được thêm vào giỏ hàng!',
                'data' => $cart,
            ], 200); // 200 OK

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Đã xảy ra lỗi!',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    //cái hàm này là thay đổi lại số lượng(khi bên client nhấn nút trừ số lượng trong giỏ hàng)
    public function updateQuantityCart(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Người dùng không tồn tại',
                ], 404);
            }

            $product = tb_product::find($request->tb_product_id);
            //tìm giỏ hàng
            $cart = tb_cart::where('user_id', $user->id)
                ->where('tb_product_id', $product->id)
                ->first();
            // Cập nhật số lượng
            $cart->quantity -= $request->quantity;
            $cart->save();

            return response()->json([
                'success' => true,
                'message' => 'Số lượng sản phẩm đã được cập nhật!',
                'data' => $cart,
            ], 200); // 200 OK

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Đã xảy ra lỗi!',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function upQuantityCart(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Người dùng không tồn tại',
                ], 404);
            }

            $product = tb_product::find($request->tb_product_id);
            //tìm giỏ hàng
            $cart = tb_cart::where('user_id', $user->id)
                ->where('tb_product_id', $product->id)
                ->first();
            // Cập nhật số lượng
            $cart->quantity += $request->quantity;
            $cart->save();

            return response()->json([
                'success' => true,
                'message' => 'Số lượng sản phẩm đã được cập nhật!',
                'data' => $cart,
            ], 200); // 200 OK

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Đã xảy ra lỗi!',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function delOneCart(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Người dùng không tồn tại',
                ], 404);
            }

            $product = tb_product::find($request->tb_product_id);
            if (!$product) {
                return response()->json([
                    'success' => false,
                    'message' => 'Sản phẩm không tồn tại',
                ], 404);
            }
            //tìm giỏ hàng
            $cart = tb_cart::where('user_id', $user->id)
                ->where('tb_product_id', $product->id)
                ->first();
            if (!$cart) {
                return response()->json([
                    'success' => false,
                    'message' => 'Sản phẩm không tồn tại trong giỏ hàng',
                ], 404);
            }

            $cart->delete();

            return response()->json([
                'success' => true,
                'message' => 'Xóa sản phẩm thành công!',
                'data' => null,
            ], 200); // 200 OK

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Đã xảy ra lỗi!',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function delAllCart()
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Người dùng không tồn tại',
                ], 404);
            }
            $cart = tb_cart::where('user_id', $user->id)->delete();
            return response()->json([
                'success' => true,
                'message' => 'Xóa thành công',
                'data' => null
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'giỏ hàng không tồn tại'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể xóa giỏ hàng'], 500);
        }
    }


    public function listCart()
    {
        $user = JWTAuth::parseToken()->authenticate();
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Người dùng không tồn tại',
            ], 404);
        }
        $cart = tb_cart::where('user_id', $user->id)->get();

        return response()->json([
            'success' => true,
            'message' => 'lấy giỏ hàng thành công!',
            'data' => $cart
        ]);
    }
}
