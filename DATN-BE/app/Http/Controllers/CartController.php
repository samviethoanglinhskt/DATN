<?php

namespace App\Http\Controllers;

use App\Models\tb_cart;
use App\Models\tb_oder;
use App\Models\tb_product;
use App\Models\tb_variant;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Log;

class CartController extends Controller
{
    public function addToCart(Request $request)
    {
        $request->validate([
            'tb_product_id' => 'required|exists:tb_products,id',
            // 'tb_variant_id' => 'required|exists:tb_variants,id',
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
            $variant = tb_variant::where('tb_product_id', $request->tb_product_id)
                     ->where('tb_size_id', $request->tb_size_id)
                     ->where('tb_color_id', $request->tb_color_id)
                     ->first();
            // Thêm sản phẩm vào giỏ hàng
            $cart = tb_cart::firstOrCreate(
                [
                    'user_id' => $user->id,
                    'tb_product_id' => $product->id,
                    'tb_variant_id' => $variant->id,
                ],
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
        $cart = tb_cart::with('variant')->where('user_id', $user->id)->get();

        return response()->json([
            'success' => true,
            'message' => 'lấy giỏ hàng thành công!',
            'data' => $cart
        ]);
    }


    public function checkoutCart(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Người dùng không tồn tại',
                ], 404);
            }

            // Lấy danh sách product_ids từ yêu cầu
            $productIds = $request->input('product_ids');

            if (empty($productIds)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không có sản phẩm nào được chọn để thanh toán',
                ], 400);
            }

            // Lấy các sản phẩm từ giỏ hàng của user với các product_ids đã chọn
            $selectedItems = tb_cart::where('user_id', $user->id)
                ->whereIn('id', $productIds)
                ->get();

            if ($selectedItems->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy sản phẩm nào trong giỏ hàng',
                ], 404);
            }

            // Tạo một mảng để lưu các đơn hàng đã tạo
            $orders = [];
            $totalOrder = 0;
            foreach ($selectedItems as $item) {
                $variant = tb_variant::find($item->tb_variant_id);
                if ($variant) {
                    $totalAmount = $variant->price * $item->quantity;
                    $totalOrder += $totalAmount;
                }
                $order = tb_oder::create([
                    'tb_cart_id' => $item->id,
                    'user_id' => $user->id,
                    'tb_discount_id' => 1,
                    'order_date' => now(),
                    'total_amount' => $totalAmount,
                    'order_status' => 'Chờ xử lý',
                    'name' => $user->name,
                    'phone' => $user->phone,
                    'address' => $user->address,
                    'email' => $user->email,
                ]);
                $orders[] = $order;
            }

            return response()->json([
                'success' => true,
                'message' => 'Lấy sản phẩm đã chọn thành công!',
                'cart-checkout' => $selectedItems,
                'order' => $orders,
                'total' => $totalOrder
            ]);
        } catch (\Exception $e) {
            Log::error('Lỗi khi đặt hàng: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra, vui lòng thử lại sau.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
