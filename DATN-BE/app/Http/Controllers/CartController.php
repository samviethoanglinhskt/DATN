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
use Illuminate\Support\Facades\Mail;
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
            // Kiểm tra số lượng tồn kho
            $availableStock = $variant->quantity;
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
            $newQuantity = $cart->quantity + $request->quantity;
            if ($newQuantity > $availableStock) {
                return response()->json([
                    'success' => false,
                    'message' => 'Số lượng sản phẩm vượt quá tồn kho. Số lượng tối đa có thể thêm là ' . ($availableStock - $cart->quantity) . '.',
                ], 400);
            }
            $cart->quantity = $newQuantity;
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
                'message' => 'Số lượng sản phẩm đã được cập nhật !',
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

            //tìm giỏ hàng
            $cart = tb_cart::where('user_id', $user->id)
                ->where('id', $request->id)
                ->first();
            $variant = tb_variant::find($cart->tb_variant_id);


            if ($variant->quantity >= $cart->quantity + $request->quantity) {
                // Cập nhật số lượng
                $cart->quantity += $request->quantity;
                $cart->save();
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Số lượng yêu cầu vượt quá số lượng tồn kho của biến thể!',
                    'số lượng biến thể' => $variant->quantity,
                ], 400);
            }


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
                'tb_discount_id' => null,
                'order_date' => now(),
                // 'total_amount' => $totalAmount,
                'order_status' => 'Chờ xử lý',
                'name' => $request->name,
                'phone' => $request->phone,
                'address' => $request->address_detail . ', ' . $request->address,
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
            $variant->quantity -= $request->quantity;
            if ($variant->quantity <= 0) {
                $variant->status = 'Hết hàng';
            }
            $variant->save();

            Mail::send('emails.mail_order_user', [
                'name' => $request->name,
                'phone' => $request->phone,
                'email' => $request->email,
                'address' => $request->address_detail . ', ' . $request->address,
                'orderCode' => $order->order_code,
                'orderStatus' => $order->order_status,
                'orderDetail' => $oderDetail,
                'orderDate' => $order->order_date,
                'productName' => $oderDetail->product->name ?? 'Không có tên sản phẩm',
                'size' => $oderDetail->variant->size->name ?? '',
                'color' => $oderDetail->variant->color->name ?? ''
            ], function ($message) use ($request) {
                $message->to($request->email)
                    ->subject('Imperial Beauty xin thông báo');
            });
            return response()->json([
                'success' => true,
                'message' => 'Lấy sản phẩm thành công!',
                'order' => $order,
                'orderDetail' => $oderDetail,

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
        $selectedItems = null; // Khởi tạo mặc định
        $orderDetails = null;
        try {
            if (isset($request->tb_product_id) && isset($request->tb_variant_id)) {
                $user = JWTAuth::parseToken()->authenticate();
                if (!$user) {
                    $id_user = 1;
                } else {
                    $id_user = $user->id;
                }
                $totalOrder = 0;
                $order = tb_oder::create([
                    'user_id' => $id_user,
                    'tb_discount_id' => $request->tb_discount_id,
                    'order_date' => now(),
                    // 'total_amount' => $totalAmount,
                    'order_status' => 'Chờ xử lý',
                    'name' => $request->name,
                    'phone' => $request->phone,
                    'address' => $request->address_detail . ', ' . $request->address,
                    'email' => $request->email,
                ]);
                $variant = tb_variant::find($request->tb_variant_id);
                if ($variant) {
                    $totalOrder = $request->total_amount;
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
                $variant->quantity -= $request->quantity;
                if ($variant->quantity <= 0) {
                    $variant->status = 'Hết hàng';
                }
                $variant->save();
            } else {
                $user = JWTAuth::parseToken()->authenticate();
                if (!$user) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Người dùng không tồn tại',
                    ], 404);
                }

                // Lấy danh sách product_ids từ yêu cầu
                $productIds = $request->cart_items;
                // $discountCode = $request->input('discount_code'); // Lấy mã giảm giá từ yêu cầu
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
                $order = tb_oder::create([
                    'user_id' => $user->id,
                    'tb_discount_id' => $request->tb_discount_id,
                    'order_date' => now(),
                    // 'total_amount' => $totalAmount,
                    'order_status' => 'Chờ xử lý',
                    'name' => $request->name,
                    'phone' => $request->phone,
                    'address' => $request->address_detail . ', ' . $request->address,
                    'email' => $request->email,
                ]);
                foreach ($selectedItems as $item) {
                    $variant = tb_variant::find($item->tb_variant_id);
                    if ($variant) {
                        $totalOrder += $item->total_amount;
                    }
                    $oderDetail = tb_oderdetail::create([
                        'tb_oder_id' => $order->id,
                        'tb_product_id' => $item->tb_product_id,
                        'tb_variant_id' => $item->tb_variant_id,
                        'quantity' => $item->quantity,
                        'price' => $variant->price
                    ]);

                    $orderDetails[] = $oderDetail;

                    //Cập nhật lại số lượng của sản phẩm
                    $variant->quantity -= $item->quantity;
                    if ($variant->quantity <= 0) {
                        $variant->status = 'Hết hàng';
                    }
                    $variant->save();

                    //Xóa giỏ hàng khi thêm đơn thành công
                    $item->delete();
                }
                // Áp dụng giảm giá theo phần trăm nếu có mã giảm giá
                // if ($tbDiscountId && isset($discount)) {
                //     $discountValue = $discount->discount_value; // Giá trị phần trăm giảm giá
                //     $totalOrder -= $totalOrder * ($discountValue / 100); // Áp dụng giảm giá theo phần trăm
                // }

                $order->order_code = 'ORD-' . $order->id;
                $order->total_amount = $request->total_amount;
                $order->save();
            }
            return response()->json([
                'success' => true,
                'message' => 'Lấy sản phẩm đã chọn thành công!',
                'cart-checkout' => $selectedItems,
                'order' => $order,
                'orderDetail' => $orderDetails,
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
                    $oder = tb_oder::where('order_code', $inputData['vnp_TxnRef'])->first();

                    if ($oder->user_id == 1) {
                        Mail::send('emails.mail_order_vnpay_user', [
                            'name' => $oder->name,
                            'orderCode' => $oder->order_code,
                            'orderStatus' => $oder->order_status,
                            'orderDate' => $oder->order_date,
                        ], function ($message) use ($oder) {
                            $message->to($oder->email)
                                ->subject('Imperial Beauty xin thông báo');
                        });
                        return redirect('http://localhost:5173/payment-success');
                    }

                    // echo "GD Thanh cong";
                    return redirect('http://localhost:5173/payment-success');
                }
            } else {
                $order = tb_oder::where('order_code', $inputData['vnp_TxnRef'])->get();
                if ($order->isNotEmpty()) {
                    foreach ($order as $orders) {
                        // Xóa các chi tiết đơn hàng liên quan
                        tb_oderdetail::where('tb_oder_id', $orders->id)->delete();
                        // Xóa đơn hàng
                        $orders->delete();
                    }
                }
                // echo "GD Khong thanh cong";
                return redirect('http://localhost:5173/payment-failure');
            }
        } else {
            echo "Chu ky khong hop le";
        }
    }

    public function vnpay(Request $request)
    {
        try {
            if (isset($request->tb_product_id) && isset($request->tb_variant_id)) {
                $user = JWTAuth::parseToken()->authenticate();
                if (!$user) {
                    $id_user = 1;
                } else {
                    $id_user = $user->id;
                }
                $totalOrder = 0;
                $order = tb_oder::create([
                    'user_id' => $id_user,
                    'tb_discount_id' => $request->tb_discount_id,
                    'order_date' => now(),
                    // 'total_amount' => $totalAmount,
                    'order_status' => 'Chờ xử lý',
                    'name' => $request->name,
                    'phone' => $request->phone,
                    'address' => $request->address_detail . ', ' . $request->address,
                    'email' => $request->email,
                ]);
                $variant = tb_variant::find($request->tb_variant_id);
                if ($variant) {
                    $totalOrder = $request->total_amount;
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
                $variant->quantity -= $request->quantity;
                $variant->save();
                $vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
                $vnp_Returnurl = route('vnpay.ipn');
                $vnp_TmnCode = "KVWATNZH"; //Mã website tại VNPAY
                $vnp_HashSecret = "3LOZH2QK4LS8CW46G9X2ZULCL1SHRNRN"; //Chuỗi bí mật

                $vnp_TxnRef = $order->order_code;
                $vnp_OrderInfo = "Thanh toán hóa đơn";
                $vnp_OrderType = "Imperial Beauty";
                $vnp_Amount = $totalOrder * 100;
                $vnp_Locale = "vn";
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
            } else {
                $user = JWTAuth::parseToken()->authenticate();
                if (!$user) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Người dùng không tồn tại',
                    ], 404);
                }
                // Lấy danh sách sản phẩm đã chọn từ giỏ hàng (thông qua checkbox)
                $productIds = $request->cart_items;
                if (empty($productIds)) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Không có sản phẩm được chọn',
                    ], 400);
                }

                // Lấy thông tin sản phẩm từ bảng cart
                $selectedItems = tb_cart::where('user_id', $user->id)
                    ->whereIn('id', $productIds)
                    ->get();

                // Kiểm tra nếu không có sản phẩm nào được tìm thấy
                if ($selectedItems->isEmpty()) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Không có sản phẩm hợp lệ trong giỏ hàng',
                    ], 404);
                }
                $orderDetails = [];
                $totalOrder = 0;

                $order = tb_oder::create([
                    'user_id' => $user->id,
                    'tb_discount_id' => 1,
                    'order_date' => now(),
                    'order_status' => 'Chờ xử lý',
                    'name' => $request->name,
                    'phone' => $request->phone,
                    'address' => $request->address_detail . ', ' . $request->address,
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
                $order->order_code = 'ORD-' . $order->id;
                $order->total_amount = $totalOrder;
                $order->save();
                $variant->quantity -= $request->quantity;
                $variant->save();
                // $orderCode = 'ORD-ONLINE' . strtoupper(uniqid());
                $vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
                $vnp_Returnurl = route('vnpay.ipn');
                $vnp_TmnCode = "KVWATNZH"; //Mã website tại VNPAY
                $vnp_HashSecret = "3LOZH2QK4LS8CW46G9X2ZULCL1SHRNRN"; //Chuỗi bí mật

                $vnp_TxnRef = $order->order_code;
                $vnp_OrderInfo = "Thanh toán hóa đơn";
                $vnp_OrderType = "Imperial Beauty";
                $vnp_Amount = $totalOrder * 100;
                $vnp_Locale = "vn";
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
            }

            return response()->json([
                'success' => true,
                'vnpay_url' => $vnp_Url,
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra, vui lòng thử lại sau.',
                'error' => $th->getMessage(),
            ], 500);
        }
    }

    public function vnpay_guest(Request $request)
    {
        try {
            $totalOrder = 0;
            $order = tb_oder::create([
                'user_id' => 1,
                'tb_discount_id' => $request->tb_discount_id,
                'order_date' => now(),
                // 'total_amount' => $totalAmount,
                'order_status' => 'Chờ xử lý',
                'name' => $request->name,
                'phone' => $request->phone,
                'address' => $request->address_detail . ', ' . $request->address,
                'email' => $request->email,
            ]);
            $variant = tb_variant::find($request->tb_variant_id);
            if ($variant) {
                $totalOrder = $request->total_amount;
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
            $variant->quantity -= $request->quantity;
            $variant->save();
            $vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
            $vnp_Returnurl = route('vnpay.ipn');
            $vnp_TmnCode = "KVWATNZH"; //Mã website tại VNPAY
            $vnp_HashSecret = "3LOZH2QK4LS8CW46G9X2ZULCL1SHRNRN"; //Chuỗi bí mật

            $vnp_TxnRef = $order->order_code;
            $vnp_OrderInfo = "Thanh toán hóa đơn";
            $vnp_OrderType = "Imperial Beauty";
            $vnp_Amount = $totalOrder * 100;
            $vnp_Locale = "vn";
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
            Mail::send('emails.mail_order_user', [
                'name' => $request->name,
                'phone' => $request->phone,
                'email' => $request->email,
                'address' => $request->address_detail . ', ' . $request->address,
                'orderCode' => $order->order_code,
                'orderStatus' => $order->order_status,
                'orderDetail' => $oderDetail,
                'orderDate' => $order->order_date,
                'productName' => $oderDetail->product->name ?? 'Không có tên sản phẩm',
                'size' => $oderDetail->variant->size->name ?? '',
                'color' => $oderDetail->variant->color->name ?? ''
            ], function ($message) use ($request) {
                $message->to($request->email)
                    ->subject('Imperial Beauty xin thông báo');
            });
            return response()->json([
                'success' => true,
                'vnpay_url' => $vnp_Url,
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra, vui lòng thử lại sau.',
                'error' => $th->getMessage(),
            ], 500);
        }
    }

    // public function execPostRequest($url, $data)
    // {
    //     $ch = curl_init($url);
    //     curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
    //     curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    //     curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    //     curl_setopt(
    //         $ch,
    //         CURLOPT_HTTPHEADER,
    //         array(
    //             'Content-Type: application/json',
    //             'Content-Length: ' . strlen($data)
    //         )
    //     );
    //     curl_setopt($ch, CURLOPT_TIMEOUT, 5);
    //     curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
    //     //execute post
    //     $result = curl_exec($ch);
    //     //close connection
    //     curl_close($ch);
    //     return $result;
    // }
}
