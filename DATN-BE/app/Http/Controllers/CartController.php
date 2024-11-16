<?php

namespace App\Http\Controllers;

use App\Models\tb_cart;
use App\Models\tb_discount;
use App\Models\tb_oder;
use App\Models\tb_oderdetail;
use App\Models\tb_product;
use App\Models\tb_variant;
use http\Env\Response;
use Illuminate\Http\Request;
use Str;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CartController extends Controller
{
    public function listToGuest(Request $request)  //
    {
        $request->validate([
            'tb_product_id' => 'required|exists:tb_products,id',
            'tb_size_id' => 'required|exists:tb_sizes,id',
            'tb_color_id' => 'required|exists:tb_colors,id',
        ]);
        try {

            $product = tb_product::findOrFail($request->tb_product_id);
            $variant = tb_variant::with(['size', 'color'])
                ->where('tb_product_id', $request->tb_product_id)
                ->where('tb_size_id', $request->tb_size_id)
                ->where('tb_color_id', $request->tb_color_id)
                ->first();

            return response()->json([
                'success' => true,
                'message' => 'Sản phẩm đã được hiển thị!',
                'product' => $product,
                'variant' => $variant,
            ], 200); // 200 OK

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Đã xảy ra lỗi!',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    public function addToCart(Request $request)
    {
        $request->validate([
            'tb_product_id' => 'required|exists:tb_products,id',
            'tb_variant_id' => 'required|exists:tb_variants,id',
            'quantity' => 'required|integer|min:1',
            // 'tb_size_id' => 'nullable|exists:tb_sizes,id',
            // 'tb_color_id' => 'nullable|exists:tb_colors,id',
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
            $variant = tb_variant::find($request->tb_variant_id);

            // Kiểm tra xem variant có tồn tại không
            if (!$variant) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy variant cho sản phẩm với size và màu đã chọn.',
                    'tb_product_id' => $request->tb_product_id,
                    'tb_variant_id' => $request->tb_variant_id
                ], 404);
            }
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

            // $product = tb_product::find($request->tb_product_id);
            //tìm giỏ hàng
            $cart = tb_cart::where('user_id', $user->id)
                ->where('id', $request->id)
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

            // $product = tb_product::find($request->tb_product_id);
            //tìm giỏ hàng
            $cart = tb_cart::where('user_id', $user->id)
                ->where('id', $request->id)
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

            //tìm giỏ hàng
            $cart = tb_cart::where('user_id', $user->id)
                ->where('id', $request->id)
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
        $cart = tb_cart::with('products', 'variant.size', 'variant.color', 'variant.images')->where('user_id', $user->id)->get();

        return response()->json([
            'success' => true,
            'message' => 'lấy giỏ hàng thành công!',
            'data' => $cart
        ]);
    }

    public function checkoutGuest(Request $request)
    { // khách vãng lai

        try {
            $totalOrder = 0;
            $order = tb_oder::create([
                'user_id' => 1,
                'tb_discount_id' => 1,
                'order_date' => now(),
                // 'total_amount' => $totalAmount,
                'order_status' => 'Chờ xử lý',
                'name' => $request->name,
                'phone' => $request->phone,
                'address' => $request->address,
                'email' => $request->email,
            ]);
            $variant = tb_variant::find($request->tb_variant_id);
            if ($variant) {
                $totalAmount = $variant->price * $request->quantity;
                $totalOrder = $totalAmount;
            }
            $oderDetail = tb_oderdetail::create([
                'tb_oder_id' => $order->id,
                'tb_product_id' => $request->tb_product_id,
                'tb_variant_id' => $request->tb_variant_id,
                'quantity' => $request->quantity,
                'price' => $variant->price
            ]);

            $order->order_code = 'ORD-' . $order->id;
            $order->total_amount = $totalOrder;
            $order->save();

            // tích hợp vnpay
            $vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
            $vnp_Returnurl = route('vnpay.ipn');
            $vnp_TmnCode = "KVWATNZH"; //Mã website tại VNPAY
            $vnp_HashSecret = "3LOZH2QK4LS8CW46G9X2ZULCL1SHRNRN"; //Chuỗi bí mật

            $vnp_TxnRef = $order->order_code; //Mã đơn hàng. Trong thực tế Merchant cần insert đơn hàng vào DB và gửi mã này
            $vnp_OrderInfo = "Thanh toán hóa đơn";
            $vnp_OrderType = "Imperial Beauty";
            $vnp_Amount = $totalOrder * 100;
            $vnp_Locale = "VN";
            //            $vnp_BankCode = "NCB";
            $vnp_IpAddr = $_SERVER['REMOTE_ADDR'];

            $inputData = array(
                "vnp_Version" => "2.1.0",
                "vnp_TmnCode" => $vnp_TmnCode,
                "vnp_Amount" => $vnp_Amount,
                "vnp_Command" => "pay",
                "vnp_CreateDate" => date('YmdHis'),
                "vnp_CurrCode" => "VND",
                "vnp_IpAddr" => $vnp_IpAddr,
                "vnp_Locale" => $vnp_Locale,
                "vnp_OrderInfo" => $vnp_OrderInfo,
                "vnp_OrderType" => $vnp_OrderType,
                "vnp_ReturnUrl" => $vnp_Returnurl,
                "vnp_TxnRef" => $vnp_TxnRef
            );

            //            if (isset($vnp_BankCode) && $vnp_BankCode != "") {
//                $inputData['vnp_BankCode'] = $vnp_BankCode;
//            }
//            if (isset($vnp_Bill_State) && $vnp_Bill_State != "") {
//                $inputData['vnp_Bill_State'] = $vnp_Bill_State;
//            }

            //var_dump($inputData);
            ksort($inputData);
            $query = "";
            $i = 0;
            $hashdata = "";
            foreach ($inputData as $key => $value) {
                if ($i == 1) {
                    $hashdata .= '&' . urlencode($key) . "=" . urlencode($value);
                } else {
                    $hashdata .= urlencode($key) . "=" . urlencode($value);
                    $i = 1;
                }
                $query .= urlencode($key) . "=" . urlencode($value) . '&';
            }

            $vnp_Url = $vnp_Url . "?" . $query;
            if (isset($vnp_HashSecret)) {
                $vnpSecureHash = hash_hmac('sha512', $hashdata, $vnp_HashSecret); //
                $vnp_Url .= 'vnp_SecureHash=' . $vnpSecureHash;
            }

            return response()->json([
                'success' => true,
                'message' => 'Lấy sản phẩm thành công!',
                'order' => $order,
                'orderDetail' => $oderDetail,
                'vnpay_url' => $vnp_Url
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
            $productIds = $request->cart_items;
            $discountCode = $request->input('discount_code'); // Lấy mã giảm giá từ yêu cầu
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
            $orderDetails = [];
            $totalOrder = 0;
            $tbDiscountId = null; // Khởi tạo giá trị cho tb_discount_id
            // Áp dụng giảm giá nếu có mã giảm giá
            // if ($discountCode) {
            //     $discount = tb_discount::where('discount_code', $discountCode)->first();
            //     if ($discount) {
            //         $tbDiscountId = $discount->id; // Lưu ID của mã giảm giá
            //     }
            // }
            $order = tb_oder::create([
                'user_id' => $user->id,
                'tb_discount_id' => $tbDiscountId,
                'order_date' => now(),
                // 'total_amount' => $totalAmount,
                'order_status' => 'Chờ xử lý',
                'name' => $request->name,
                'phone' => $request->phone,
                'address' => $request->address,
                'email' => $request->email,
            ]);
            foreach ($selectedItems as $item) {
                $variant = tb_variant::find($item->tb_variant_id);
                if ($variant) {
                    $totalAmount = $variant->price * $item->quantity;
                    $totalOrder += $totalAmount;
                }
                $oderDetail = tb_oderdetail::create([
                    'tb_oder_id' => $order->id,
                    'tb_product_id' => $item->tb_product_id,
                    'tb_variant_id' => $item->tb_variant_id,
                    'quantity' => $item->quantity,
                    'price' => $variant->price
                ]);

                $orderDetails[] = $oderDetail;
            }
            // Áp dụng giảm giá theo phần trăm nếu có mã giảm giá
            // if ($tbDiscountId && isset($discount)) {
            //     $discountValue = $discount->discount_value; // Giá trị phần trăm giảm giá
            //     $totalOrder -= $totalOrder * ($discountValue / 100); // Áp dụng giảm giá theo phần trăm
            // }

            $order->order_code = 'ORD-' . $order->id;
            $order->total_amount = $request->total_amount;
            $order->save();
            // tích hợp vnpay
            $vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
            $vnp_Returnurl = route('vnpay.ipn');
            $vnp_TmnCode = "KVWATNZH"; //Mã website tại VNPAY
            $vnp_HashSecret = "3LOZH2QK4LS8CW46G9X2ZULCL1SHRNRN"; //Chuỗi bí mật

            $vnp_TxnRef = $order->order_code; //Mã đơn hàng. Trong thực tế Merchant cần insert đơn hàng vào DB và gửi mã này
            $vnp_OrderInfo = "Thanh toán hóa đơn";
            $vnp_OrderType = "Imperial Beauty";
            $vnp_Amount = $totalOrder * 100;
            $vnp_Locale = "VN";
            $vnp_BankCode = "NCB";
            $vnp_IpAddr = $_SERVER['REMOTE_ADDR'];

            $inputData = array(
                "vnp_Version" => "2.1.0",
                "vnp_TmnCode" => $vnp_TmnCode,
                "vnp_Amount" => $vnp_Amount,
                "vnp_Command" => "pay",
                "vnp_CreateDate" => date('YmdHis'),
                "vnp_CurrCode" => "VND",
                "vnp_IpAddr" => $vnp_IpAddr,
                "vnp_Locale" => $vnp_Locale,
                "vnp_OrderInfo" => $vnp_OrderInfo,
                "vnp_OrderType" => $vnp_OrderType,
                "vnp_ReturnUrl" => $vnp_Returnurl,
                "vnp_TxnRef" => $vnp_TxnRef
            );

            if (isset($vnp_BankCode) && $vnp_BankCode != "") {
                $inputData['vnp_BankCode'] = $vnp_BankCode;
            }
            if (isset($vnp_Bill_State) && $vnp_Bill_State != "") {
                $inputData['vnp_Bill_State'] = $vnp_Bill_State;
            }

            //var_dump($inputData);
            ksort($inputData);
            $query = "";
            $i = 0;
            $hashdata = "";
            foreach ($inputData as $key => $value) {
                if ($i == 1) {
                    $hashdata .= '&' . urlencode($key) . "=" . urlencode($value);
                } else {
                    $hashdata .= urlencode($key) . "=" . urlencode($value);
                    $i = 1;
                }
                $query .= urlencode($key) . "=" . urlencode($value) . '&';
            }

            $vnp_Url = $vnp_Url . "?" . $query;
            if (isset($vnp_HashSecret)) {
                $vnpSecureHash = hash_hmac('sha512', $hashdata, $vnp_HashSecret); //
                $vnp_Url .= 'vnp_SecureHash=' . $vnpSecureHash;
            }

            return response()->json([
                'success' => true,
                'message' => 'Lấy sản phẩm đã chọn thành công!',
                'cart-checkout' => $selectedItems,
                'order' => $order,
                'orderDetail' => $orderDetails,
                'vnpay_url' => $vnp_Url
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
    public function handleVnpayIpn(Request $request)
    {
        // Lấy tất cả các thông tin từ query string
        $inputData = $request->all();
        $vnp_HashSecret = "3LOZH2QK4LS8CW46G9X2ZULCL1SHRNRN"; // Chuỗi bí mật của bạn từ VNPay

        // Tách mã kiểm tra (checksum) ra khỏi dữ liệu đầu vào
        $vnp_SecureHash = $inputData['vnp_SecureHash'];
        unset($inputData['vnp_SecureHash']);

        // Sắp xếp dữ liệu theo thứ tự tăng dần của key để kiểm tra chữ ký
        ksort($inputData);
        $i = 0;
        $hashData = "";
        foreach ($inputData as $key => $value) {
            if ($i == 1) {
                $hashData = $hashData . '&' . urlencode($key) . "=" . urlencode($value);
            } else {
                $hashData = $hashData . urlencode($key) . "=" . urlencode($value);
                $i = 1;
            }
        }

        $secureHash = hash_hmac('sha512', $hashData, $vnp_HashSecret);

        if ($secureHash == $vnp_SecureHash) {
            if ($_GET['vnp_ResponseCode'] == '00') {
                $order = tb_oder::where('order_code', $inputData['vnp_TxnRef'])->get();
                if ($order->isNotEmpty()) {
                    // Cập nhật trạng thái đơn hàng thành "Đã thanh toán"
                    foreach ($order as $orders) {
                        $orders->update(['order_status' => 'Đã thanh toán']);
                    }
                    echo "GD Thanh cong";
                }
            } else {
                echo "GD Khong thanh cong";
            }
        } else {
            echo "Chu ky khong hop le";
        }
    }
}
