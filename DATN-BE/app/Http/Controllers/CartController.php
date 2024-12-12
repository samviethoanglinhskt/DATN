<?php

namespace App\Http\Controllers;

use App\Models\tb_cart;
use App\Models\tb_discount;
use App\Models\tb_oder;
use App\Models\tb_oderdetail;
use App\Models\tb_product;
use App\Models\tb_variant;
use App\Models\TbOderdetailTemp;
use App\Models\TbOderTemp;
use http\Env\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Str;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Events\ProductLocked;

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
        $orderDetails = null;
        $oderDetail = null;
        try {
            if (isset($request->tb_product_id) && isset($request->tb_variant_id)) {
                $totalOrder = 0;
                $order = tb_oder::create([
                    'user_id' => 1,
                    'order_date' => now(),
                    'order_status' => 'Chờ xử lý',
                    'name' => $request->name,
                    'phone' => $request->phone,
                    'address' => $request->address_detail . ', ' . $request->address,
                    'email' => $request->email,
                ]);
                // Sử dụng giao dịch để đảm bảo tính toàn vẹn dữ liệu
                DB::transaction(function () use ($request, &$order, &$totalOrder, &$oderDetail) {
                    // Khóa sản phẩm để tránh nhiều người dùng thay đổi số lượng cùng lúc
                    $variant = tb_variant::where('id', $request->tb_variant_id)->lockForUpdate()->first();

                    if ($variant) {
                        // Kiểm tra số lượng sản phẩm còn lại
                        if ($request->quantities > $variant->quantity) {
                            return response()->json([
                                'success' => false,
                                'message' => 'Sản phẩm không đủ số lượng',
                            ]);
                        } else {
                            // Tạo chi tiết đơn hàng
                            $oderDetail = tb_oderdetail::create([
                                'tb_oder_id' => $order->id,
                                'tb_product_id' => $request->tb_product_id,
                                'tb_variant_id' => $request->tb_variant_id,
                                'quantity' => $request->quantities,
                                'price' => $variant->price
                            ]);
                            // Cập nhật số lượng sản phẩm còn lại
                            $variant->quantity -= $request->quantities;

                            // Kiểm tra lại trạng thái sản phẩm và cập nhật
                            if ($variant->quantity <= 0) {
                                $variant->status = 'Hết hàng';
                            } else {
                                $variant->status = 'Còn hàng';
                            }
                            $variant->save();

                            $totalOrder += $request->quantities * $variant->price;

                            // Cập nhật thông tin đơn hàng
                            $order->order_code = 'ORD-' . $order->id;
                            $order->total_amount = $totalOrder;
                            $order->save();

                            // Phát sóng sự kiện thông báo sản phẩm bị khóa sau khi cập nhật thành công
                            broadcast(new ProductLocked($variant, 1));
                        }
                    } else {
                        return response()->json([
                            'success' => false,
                            'message' => 'Sản phẩm không tồn tại',
                        ]);
                    }
                });

                // Gửi email
                Mail::send('emails.mail_order_guest_buynow', [
                    'name' => $order->name,
                    'phone' => $order->phone,
                    'email' => $order->email,
                    'address' => $order->address,
                    'orderCode' => $order->order_code,
                    'orderStatus' => $order->order_status,
                    'orderDate' => $order->order_date,
                    'productName' => optional($oderDetail)->product->name ?? '',
                    'size' => optional($oderDetail)->variant->size->name ?? '',
                    'color' => optional($oderDetail)->variant->color->name ?? '',
                    'orderDetail' => $oderDetail,
                    'totalAmount' => $order->total_amount,
                ], function ($message) use ($order) {
                    $message->to($order->email)
                        ->subject('Imperial Beauty xin thông báo');
                });

                return response()->json([
                    'success' => true,
                    'message' => 'Đặt hàng thành công!',
                    'order' => $order,
                    'orderDetail' => $oderDetail,
                ]);
            } else {
                // Lấy danh sách product_ids từ yêu cầu
                $productIds = $request->quantities;
                // return response()->json($productIds);

                if (empty($productIds)) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Không có sản phẩm nào được chọn để thanh toán',
                    ], 400);
                }
                // Tạo một mảng để lưu các đơn hàng đã tạo
                $orderDetails = [];
                $totalOrder = 0;
                // Tạo đơn hàng mới
                $order = tb_oder::create([
                    'user_id' => 1,
                    'tb_discount_id' => $request->tb_discount_id,
                    'order_date' => now(),
                    'order_status' => 'Chờ xử lý',
                    'name' => $request->name,
                    'phone' => $request->phone,
                    'address' => $request->address_detail . ', ' . $request->address,
                    'email' => $request->email,
                ]);
                // Sử dụng giao dịch để đảm bảo tính toàn vẹn dữ liệu
                DB::transaction(function () use ($request, $productIds, &$order, &$orderDetails, &$totalOrder) {
                    foreach ($productIds as $item) {
                        $item = (object) $item;
                        // Khóa bi quan để ngăn chặn người dùng khác thao tác trên biến thể sản phẩm này cùng lúc
                        $variant = tb_variant::where('id', $item->id)->lockForUpdate()->first();
                        if ($variant && $variant->quantity >= $item->quantity) {
                            // Phát sóng sự kiện thông báo sản phẩm bị khóa
                            broadcast(new ProductLocked($variant, 1));
                            $totalOrder += $item->quantity * $variant->price;
                            // Tạo chi tiết đơn hàng mới
                            $oderDetail = tb_oderdetail::create([
                                'tb_oder_id' => $order->id,
                                'tb_product_id' => $variant->tb_product_id,
                                'tb_variant_id' => $item->id,
                                'quantity' => $item->quantity,
                                'price' => $variant->price
                            ]);
                            $orderDetails[] = $oderDetail;
                            // Cập nhật lại số lượng sản phẩm
                            $variant->quantity -= $item->quantity;
                            if ($variant->quantity <= 0) {
                                $variant->status = 'Hết hàng';
                            } else {
                                $variant->status = 'Còn hàng';
                            }
                            $variant->save();
                        } else {
                            throw new \Exception('Sản phẩm không đủ số lượng');
                        }
                    }

                    // Cập nhật thông tin đơn hàng
                    $order->order_code = 'ORD-' . $order->id;
                    $order->total_amount = $request->total_amount;
                    $order->save();
                });

                // Gửi email
                Mail::send('emails.mail_order_guest_cart', [
                    'name' => $order->name,
                    'phone' => $order->phone,
                    'email' => $order->email,
                    'address' => $order->address,
                    'orderCode' => $order->order_code,
                    'orderStatus' => $order->order_status,
                    'orderDate' => $order->order_date,
                    'orderDetail' => $orderDetails,
                    'totalAmount' => $order->total_amount,
                ], function ($message) use ($order) {
                    $message->to($order->email)
                        ->subject('Imperial Beauty xin thông báo');
                });

                return response()->json([
                    'success' => true,
                    'message' => 'Đặt hàng thành công!',
                    'cart-checkout' => $productIds,
                    'order' => $order,
                    'orderDetail' => $orderDetails,
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Lỗi khi đặt hàng: ' . $e->getMessage());
            return response()->json(
                [
                    'success' => false,
                    'message' => 'Có lỗi xảy ra, vui lòng thử lại sau.',
                    'error' => $e->getMessage(),
                ],
                500
            );
        }
    }

    public function checkoutCart(Request $request)
    {
        $selectedItems = null; // Khởi tạo mặc định
        $orderDetails = null;
        $oderDetail = null; // Khởi tạo mặc định
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
                    'order_status' => 'Chờ xử lý',
                    'name' => $request->name,
                    'phone' => $request->phone,
                    'address' => $request->address_detail . ', ' . $request->address,
                    'email' => $request->email,
                ]);

                // Sử dụng giao dịch để đảm bảo tính toàn vẹn dữ liệu
                DB::transaction(function () use ($request, &$order, &$totalOrder, &$oderDetail, $user) {
                    // Khóa sản phẩm để tránh nhiều người dùng thay đổi số lượng cùng lúc
                    $variant = tb_variant::where('id', $request->tb_variant_id)->lockForUpdate()->first();

                    if ($variant) {
                        // Kiểm tra số lượng sản phẩm còn lại
                        if ($request->quantities > $variant->quantity) {
                            return response()->json([
                                'success' => false,
                                'message' => 'Sản phẩm không đủ số lượng',
                            ]);
                        } else {
                            // Tạo chi tiết đơn hàng
                            $oderDetail = tb_oderdetail::create([
                                'tb_oder_id' => $order->id,
                                'tb_product_id' => $request->tb_product_id,
                                'tb_variant_id' => $request->tb_variant_id,
                                'quantity' => $request->quantities,
                                'price' => $variant->price
                            ]);
                            // Cập nhật số lượng sản phẩm còn lại
                            $variant->quantity -= $request->quantities;

                            // Kiểm tra lại trạng thái sản phẩm và cập nhật
                            if ($variant->quantity <= 0) {
                                $variant->status = 'Hết hàng';
                            } else {
                                $variant->status = 'Còn hàng';
                            }
                            $variant->save();

                            // $totalOrder += $request->quantities * $variant->price;

                            // Cập nhật thông tin đơn hàng
                            $order->order_code = 'ORD-' . $order->id;
                            $order->total_amount = $request->total_amount;
                            $order->save();

                            // Phát sóng sự kiện thông báo sản phẩm bị khóa sau khi cập nhật thành công
                            broadcast(new ProductLocked($variant, $user->id));
                        }
                    } else {
                        return response()->json([
                            'success' => false,
                            'message' => 'Sản phẩm không tồn tại',
                        ]);
                    }
                });

                Mail::send('emails.mail_order_guest_buynow', [
                    'name' => $order->name,
                    'phone' => $order->phone,
                    'email' => $order->email,
                    'address' => $order->address,
                    'orderCode' => $order->order_code,
                    'orderStatus' => $order->order_status,
                    'orderDate' => $order->order_date,
                    'productName' => optional($oderDetail)->product->name ?? '',
                    'size' => optional($oderDetail)->variant->size->name ?? '',
                    'color' => optional($oderDetail)->variant->color->name ?? '',
                    'orderDetail' => $oderDetail,
                    'totalAmount' => $order->total_amount,
                ], function ($message) use ($order) {
                    $message->to($order->email)
                        ->subject('Imperial Beauty xin thông báo');
                });

                return response()->json([
                    'success' => true,
                    'message' => 'Đặt hàng thành công!',
                    'order' => $order,
                    'orderDetail' => $oderDetail,
                ]);
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
                if (empty($productIds)) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Không có sản phẩm nào được chọn để thanh toán',
                    ], 400);
                }
                // Lấy các sản phẩm từ giỏ hàng của user với các product_ids đã chọn
                $selectedItems = tb_cart::where('user_id', $user->id)->whereIn('id', $productIds)->get();
                if ($selectedItems->isEmpty()) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Không tìm thấy sản phẩm nào trong giỏ hàng',
                    ], 404);
                }
                // Tạo một mảng để lưu các đơn hàng đã tạo
                $orderDetails = [];
                $totalOrder = 0;
                // Tạo đơn hàng mới
                $order = tb_oder::create([
                    'user_id' => $user->id,
                    'tb_discount_id' => $request->tb_discount_id,
                    'order_date' => now(),
                    'order_status' => 'Chờ xử lý',
                    'name' => $request->name,
                    'phone' => $request->phone,
                    'address' => $request->address_detail . ', ' . $request->address,
                    'email' => $request->email,
                ]);
                // Sử dụng giao dịch để đảm bảo tính toàn vẹn dữ liệu
                DB::transaction(function () use ($request, $selectedItems, &$order, &$orderDetails, &$totalOrder, $user) {
                    foreach ($selectedItems as $item) {
                        // Khóa bi quan để ngăn chặn người dùng khác thao tác trên biến thể sản phẩm này cùng lúc
                        $variant = tb_variant::where('id', $item->tb_variant_id)->lockForUpdate()->first();
                        if ($variant && $variant->quantity >= $item->quantity) {
                            // Phát sóng sự kiện thông báo sản phẩm bị khóa
                            broadcast(new ProductLocked($variant, $user->id));
                            $totalOrder += $item->quantity * $variant->price;
                            // Tạo chi tiết đơn hàng mới
                            $oderDetail = tb_oderdetail::create([
                                'tb_oder_id' => $order->id,
                                'tb_product_id' => $item->tb_product_id,
                                'tb_variant_id' => $item->tb_variant_id,
                                'quantity' => $item->quantity,
                                'price' => $variant->price
                            ]);
                            $orderDetails[] = $oderDetail;
                            // Cập nhật lại số lượng sản phẩm
                            $variant->quantity -= $item->quantity;
                            if ($variant->quantity <= 0) {
                                $variant->status = 'Hết hàng';
                            } else {
                                $variant->status = 'Còn hàng';
                            }
                            $variant->save();
                            // Xóa giỏ hàng khi thêm đơn thành công
                            $item->delete();
                        } else {
                            throw new \Exception('Sản phẩm không đủ số lượng');
                        }
                    }

                    // Cập nhật thông tin đơn hàng
                    $order->order_code = 'ORD-' . $order->id;
                    $order->total_amount = $request->total_amount;
                    $order->save();
                });

                // Gửi email
                Mail::send('emails.mail_order_guest_cart', [
                    'name' => $order->name,
                    'phone' => $order->phone,
                    'email' => $order->email,
                    'address' => $order->address,
                    'orderCode' => $order->order_code,
                    'orderStatus' => $order->order_status,
                    'orderDate' => $order->order_date,
                    'orderDetail' => $orderDetails,
                    'totalAmount' => $order->total_amount,
                ], function ($message) use ($order) {
                    $message->to($order->email)
                        ->subject('Imperial Beauty xin thông báo');
                });
                
                return response()->json([
                    'success' => true,
                    'message' => 'Đặt hàng thành công!',
                    'cart-checkout' => $selectedItems,
                    'order' => $order,
                    'orderDetail' => $orderDetails,
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Lỗi khi đặt hàng: ' . $e->getMessage());
            return response()->json(
                [
                    'success' => false,
                    'message' => 'Có lỗi xảy ra, vui lòng thử lại sau.',
                    'error' => $e->getMessage(),
                ],
                500
            );
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
                $orderTemp = TbOderTemp::where('order_code', $inputData['vnp_TxnRef'])->first();
                if ($orderTemp) {
                    // Cập nhật trạng thái đơn hàng thành "Đã thanh toán"
                    $orderReal = tb_oder::create([
                        'user_id' => $orderTemp->user_id,
                        'tb_discount_id' => $orderTemp->tb_discount_id,
                        'order_code' => $orderTemp->order_code,
                        'total_amount' => $orderTemp->total_amount,
                        'order_status' => 'Đã thanh toán',
                        'name' => $orderTemp->name,
                        'phone' => $orderTemp->phone,
                        'address' => $orderTemp->address,
                        'email' => $orderTemp->email,
                        'order_date' => $orderTemp->order_date,
                        'order_type' => $orderTemp->order_type,
                    ]);
                    $orderDetailsTemp = TbOderdetailTemp::where('tb_oder_temp_id', $orderTemp->id)->get();
                    foreach ($orderDetailsTemp as $detailTemp) {

                        tb_oderdetail::create([
                            'tb_oder_id' => $orderReal->id,
                            'tb_product_id' => $detailTemp->tb_product_id,
                            'tb_variant_id' => $detailTemp->tb_variant_id,
                            'quantity' => $detailTemp->quantity,
                            'price' => $detailTemp->price,
                        ]);
                        $variant = tb_variant::find($detailTemp->tb_variant_id);
                        $variant->quantity -= $detailTemp->quantity;
                        if ($variant->quantity <= 0) {
                            $variant->status = 'Hết hàng';
                        } else {
                            $variant->status = 'Còn hàng';
                        }
                        $variant->save();
                    }

                    // Kiểm tra xem là mua ngay hay từ giỏ hàng
                    if ($orderTemp->order_type == 'cart') {
                        // Mua từ giỏ hàng -> Xóa giỏ hàng
                        $orderDetailsTemp = TbOderdetailTemp::where('tb_oder_temp_id', $orderTemp->id)->get();
                        foreach ($orderDetailsTemp as $detailTemp) {
                            tb_cart::where('user_id', $orderTemp->user_id)
                                ->where('tb_product_id', $detailTemp->tb_product_id)
                                ->where('tb_variant_id', $detailTemp->tb_variant_id)
                                ->delete();
                        }
                        // tb_cart::where('user_id', $orderTemp->user_id)->delete();
                    }
                    // Xóa dữ liệu bảng tạm
                    TbOderdetailTemp::where('tb_oder_temp_id', $orderTemp->id)->delete();
                    $orderTemp->delete();

                    // $oder = TbOderTemp::where('order_code', $inputData['vnp_TxnRef'])->first();

                    // if ($oder->user_id == 1) {
                    //     Mail::send('emails.mail_order_vnpay_user', [
                    //         'name' => $oder->name,
                    //         'orderCode' => $oder->order_code,
                    //         'orderStatus' => $oder->order_status,
                    //         'orderDate' => $oder->order_date,
                    //     ], function ($message) use ($oder) {
                    //         $message->to($oder->email)
                    //             ->subject('Imperial Beauty xin thông báo');
                    //     });
                    //     return redirect('http://localhost:5173/payment-success');
                    // }

                    // echo "GD Thanh cong";
                    return redirect('http://localhost:5173/payment-success');
                }
            } else {
                $orderTemp = TbOderTemp::where('order_code', $inputData['vnp_TxnRef'])->first();
                if ($orderTemp) {
                    // Cập nhật trạng thái đơn hàng thành "Đã thanh toán"
                    $orderReal = tb_oder::create([
                        'user_id' => $orderTemp->user_id,
                        'tb_discount_id' => $orderTemp->tb_discount_id,
                        'order_code' => $orderTemp->order_code,
                        'total_amount' => $orderTemp->total_amount,
                        'order_status' => 'Chưa thanh toán',
                        'name' => $orderTemp->name,
                        'phone' => $orderTemp->phone,
                        'address' => $orderTemp->address,
                        'email' => $orderTemp->email,
                        'order_date' => $orderTemp->order_date,
                        'order_type' => $orderTemp->order_type,
                    ]);
                    $orderDetailsTemp = TbOderdetailTemp::where('tb_oder_temp_id', $orderTemp->id)->get();
                    foreach ($orderDetailsTemp as $detailTemp) {

                        tb_oderdetail::create([
                            'tb_oder_id' => $orderReal->id,
                            'tb_product_id' => $detailTemp->tb_product_id,
                            'tb_variant_id' => $detailTemp->tb_variant_id,
                            'quantity' => $detailTemp->quantity,
                            'price' => $detailTemp->price,
                        ]);
                        // $variant = tb_variant::find($detailTemp->tb_variant_id);
                        // $variant->quantity -= $detailTemp->quantity;
                        // if ($variant->quantity <= 0) {
                        //     $variant->status = 'Hết hàng';
                        // } else {
                        //     $variant->status = 'Còn hàng';
                        // }
                        // $variant->save();
                    }

                    // Kiểm tra xem là mua ngay hay từ giỏ hàng
                    if ($orderTemp->order_type == 'cart') {
                        // Mua từ giỏ hàng -> Xóa giỏ hàng
                        $orderDetailsTemp = TbOderdetailTemp::where('tb_oder_temp_id', $orderTemp->id)->get();
                        foreach ($orderDetailsTemp as $detailTemp) {
                            tb_cart::where('user_id', $orderTemp->user_id)
                                ->where('tb_product_id', $detailTemp->tb_product_id)
                                ->where('tb_variant_id', $detailTemp->tb_variant_id)
                                ->delete();
                        }
                        // tb_cart::where('user_id', $orderTemp->user_id)->delete();
                    }
                    // Xóa dữ liệu bảng tạm
                    TbOderdetailTemp::where('tb_oder_temp_id', $orderTemp->id)->delete();
                    $orderTemp->delete();

                    // $oder = TbOderTemp::where('order_code', $inputData['vnp_TxnRef'])->first();

                    // if ($oder->user_id == 1) {
                    //     Mail::send('emails.mail_order_vnpay_user', [
                    //         'name' => $oder->name,
                    //         'orderCode' => $oder->order_code,
                    //         'orderStatus' => $oder->order_status,
                    //         'orderDate' => $oder->order_date,
                    //     ], function ($message) use ($oder) {
                    //         $message->to($oder->email)
                    //             ->subject('Imperial Beauty xin thông báo');
                    //     });
                    //     return redirect('http://localhost:5173/payment-success');
                    // }

                    return redirect('http://localhost:5173/payment-failure');
                }
            }
        } else {
            echo "Chu ky khong hop le";
        }
    }
    public function handleVnpayIpnGuest(Request $request)
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
                $orderTemp = TbOderTemp::where('order_code', $inputData['vnp_TxnRef'])->first();
                if ($orderTemp) {
                    // Cập nhật trạng thái đơn hàng thành "Đã thanh toán"
                    $orderReal = tb_oder::create([
                        'user_id' => $orderTemp->user_id,
                        'tb_discount_id' => $orderTemp->tb_discount_id,
                        'order_code' => $orderTemp->order_code,
                        'total_amount' => $orderTemp->total_amount,
                        'order_status' => 'Đã thanh toán',
                        'name' => $orderTemp->name,
                        'phone' => $orderTemp->phone,
                        'address' => $orderTemp->address,
                        'email' => $orderTemp->email,
                        'order_date' => $orderTemp->order_date,
                        'order_type' => $orderTemp->order_type,
                    ]);
                    $orderDetailsTemp = TbOderdetailTemp::where('tb_oder_temp_id', $orderTemp->id)->get();
                    foreach ($orderDetailsTemp as $detailTemp) {

                        tb_oderdetail::create([
                            'tb_oder_id' => $orderReal->id,
                            'tb_product_id' => $detailTemp->tb_product_id,
                            'tb_variant_id' => $detailTemp->tb_variant_id,
                            'quantity' => $detailTemp->quantity,
                            'price' => $detailTemp->price,
                        ]);
                        $variant = tb_variant::find($detailTemp->tb_variant_id);
                        $variant->quantity -= $detailTemp->quantity;
                        if ($variant->quantity <= 0) {
                            $variant->status = 'Hết hàng';
                        } else {
                            $variant->status = 'Còn hàng';
                        }
                        $variant->save();
                    }

                    // Xóa dữ liệu bảng tạm
                    TbOderdetailTemp::where('tb_oder_temp_id', $orderTemp->id)->delete();
                    $orderTemp->delete();

                    // $oder = TbOderTemp::where('order_code', $inputData['vnp_TxnRef'])->first();

                    // if ($oder->user_id == 1) {
                    //     Mail::send('emails.mail_order_vnpay_user', [
                    //         'name' => $oder->name,
                    //         'orderCode' => $oder->order_code,
                    //         'orderStatus' => $oder->order_status,
                    //         'orderDate' => $oder->order_date,
                    //     ], function ($message) use ($oder) {
                    //         $message->to($oder->email)
                    //             ->subject('Imperial Beauty xin thông báo');
                    //     });
                    //     return redirect('http://localhost:5173/payment-success');
                    // }

                    // echo "GD Thanh cong";
                    return redirect('http://localhost:5173/payment-success');
                }
            } else {
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
                $order = TbOderTemp::create([
                    'user_id' => $id_user,
                    'tb_discount_id' => $request->tb_discount_id,
                    'order_date' => now(),
                    'order_type' => 'quick',
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
                $oderDetail = TbOderdetailTemp::create([
                    'tb_oder_temp_id' => $order->id,
                    'tb_product_id' => $request->tb_product_id,
                    'tb_variant_id' => $request->tb_variant_id,
                    'quantity' => $request->quantities,
                    'price' => $variant->price
                ]);

                $order->order_code = 'ORD-OL' . $order->id;
                $order->total_amount = $totalOrder;
                $order->save();
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

                $order = TbOderTemp::create([
                    'user_id' => $user->id,
                    'tb_discount_id' => 1,
                    'order_date' => now(),
                    'order_type' => 'cart',
                    'order_status' => 'Chờ xử lý',
                    'name' => $request->name,
                    'phone' => $request->phone,
                    'address' => $request->address_detail . ', ' . $request->address,
                    'email' => $request->email,
                ]);
                foreach ($selectedItems as $item) {
                    $variant = tb_variant::find($item->tb_variant_id);
                    if ($variant) {
                        $totalOrder = $request->total_amount;
                    }
                    $oderDetail = TbOderdetailTemp::create([
                        'tb_oder_temp_id' => $order->id,
                        'tb_product_id' => $item->tb_product_id,
                        'tb_variant_id' => $item->tb_variant_id,
                        'quantity' => $item->quantity,
                        'price' => $variant->price
                    ]);

                    $orderDetails[] = $oderDetail;
                }
                $order->order_code = 'ORD-OL' . $order->id;
                $order->total_amount = $totalOrder;
                $order->save();

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
    public function handleVnpayIpnReOrder(Request $request)
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
                $orderTemp = tb_oder::where('order_code', $inputData['vnp_TxnRef'])->first();
                if ($orderTemp) {
                    $orderTemp->update(['order_status' => 'Đã thanh toán']);
                    $orderDetailsTemp = tb_oderdetail::where('tb_oder_id', $orderTemp->id)->get();

                    foreach ($orderDetailsTemp as $ok) {
                        $variant = tb_variant::find($ok->tb_variant_id);
                        $variant->quantity -= $ok->quantity;
                        if ($variant->quantity <= 0) {
                            $variant->status = 'Hết hàng';
                        } else {
                            $variant->status = 'Còn hàng';
                        }
                    }
                    $variant->save();
                    // Kiểm tra xem là mua ngay hay từ giỏ hàng
                    if ($orderTemp->order_type == 'cart') {
                        // Mua từ giỏ hàng -> Xóa giỏ hàng
                        $orderDetailsTemp = tb_oderdetail::where('tb_oder_id', $orderTemp->id)->get();
                        foreach ($orderDetailsTemp as $detailTemp) {
                            tb_cart::where('user_id', $orderTemp->user_id)
                                ->where('tb_product_id', $detailTemp->tb_product_id)
                                ->where('tb_variant_id', $detailTemp->tb_variant_id)
                                ->delete();
                        }
                    }
                }



                // $oder = TbOderTemp::where('order_code', $inputData['vnp_TxnRef'])->first();

                // if ($oder->user_id == 1) {
                //     Mail::send('emails.mail_order_vnpay_user', [
                //         'name' => $oder->name,
                //         'orderCode' => $oder->order_code,
                //         'orderStatus' => $oder->order_status,
                //         'orderDate' => $oder->order_date,
                //     ], function ($message) use ($oder) {
                //         $message->to($oder->email)
                //             ->subject('Imperial Beauty xin thông báo');
                //     });
                //     return redirect('http://localhost:5173/payment-success');
                // }

                // echo "GD Thanh cong";
                return redirect('http://localhost:5173/payment-success');
            } else {
                return redirect('http://localhost:5173/payment-failure');
            }
        } else {
            echo "Chu ky khong hop le";
        }
    }
    public function reOrder(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Người dùng không tồn tại',
            ], 404);
        }
        $checkOrder = $request->input('clickOrder');
        $order = tb_oder::with('oderDetails')->where('id', $checkOrder)->first();

        // Kiểm tra số lượng sản phẩm trong kho trước khi tạo lại đơn hàng
        foreach ($order->oderDetails as $detail) {
            $variant = tb_variant::find($detail->tb_variant_id);
            if ($variant->quantity < $detail->quantity) {
                return response()->json([
                    'success' => false,
                    'message' => 'Sản phẩm này tạm thời đã hết hàng.',
                ], 400);
            }
        }

        $vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        $vnp_Returnurl = route('vnpay.ipn.reorder');
        $vnp_TmnCode = "KVWATNZH"; //Mã website tại VNPAY
        $vnp_HashSecret = "3LOZH2QK4LS8CW46G9X2ZULCL1SHRNRN"; //Chuỗi bí mật

        $vnp_TxnRef = $order->order_code;
        $vnp_OrderInfo = "Thanh toán hóa đơn";
        $vnp_OrderType = "Imperial Beauty";
        $vnp_Amount = $order->total_amount * 100;
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

        return response()->json([
            'Message' => 'Mua lại sản phẩm',
            'Link' => $vnp_Url
        ]);
    }
    public function vnpay_guest(Request $request)
    {
        try {
            if (isset($request->tb_product_id) && isset($request->tb_variant_id)) {
                $totalOrder = 0;
                $order = TbOderTemp::create([
                    'user_id' => 1,
                    'tb_discount_id' => $request->tb_discount_id,
                    'order_date' => now(),
                    'order_type' => 'quick',
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
                $oderDetail = TbOderdetailTemp::create([
                    'tb_oder_temp_id' => $order->id,
                    'tb_product_id' => $request->tb_product_id,
                    'tb_variant_id' => $request->tb_variant_id,
                    'quantity' => $request->quantities,
                    'price' => $variant->price
                ]);

                $order->order_code = 'ORD-OL' . $order->id;
                $order->total_amount = $totalOrder;
                $order->save();
                $vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
                $vnp_Returnurl = route('vnpay.ipn.guest');
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
                // Mail::send('emails.mail_order_user', [
                //     'name' => $request->name,
                //     'phone' => $request->phone,
                //     'email' => $request->email,
                //     'address' => $request->address_detail . ', ' . $request->address,
                //     'orderCode' => $order->order_code,
                //     'orderStatus' => $order->order_status,
                //     'orderDetail' => $oderDetail,
                //     'orderDate' => $order->order_date,
                //     'productName' => $oderDetail->product->name ?? 'Không có tên sản phẩm',
                //     'size' => $oderDetail->variant->size->name ?? '',
                //     'color' => $oderDetail->variant->color->name ?? ''
                // ], function ($message) use ($request) {
                //     $message->to($request->email)
                //         ->subject('Imperial Beauty xin thông báo');
                // });

            } else {
                $productIds = $request->quantities;
                if (empty($productIds)) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Không có sản phẩm được chọn',
                    ], 400);
                }
                $orderDetails = [];
                $totalOrder = 0;

                $order = TbOderTemp::create([
                    'user_id' => 1,
                    'tb_discount_id' => $request->tb_discount_id,
                    'order_date' => now(),
                    'order_type' => 'cart',
                    'order_status' => 'Chờ xử lý',
                    'name' => $request->name,
                    'phone' => $request->phone,
                    'address' => $request->address_detail . ', ' . $request->address,
                    'email' => $request->email,
                ]);
                foreach ($productIds as $item) {
                    $item = (object) $item;
                    $variant = tb_variant::find($item->id);
                    if ($variant) {
                        $totalOrder = $request->total_amount;
                    }
                    $oderDetail = TbOderdetailTemp::create([
                        'tb_oder_temp_id' => $order->id,
                        'tb_product_id' => $variant->tb_product_id,
                        'tb_variant_id' => $item->id,
                        'quantity' => $item->quantity,
                        'price' => $variant->price
                    ]);

                    $orderDetails[] = $oderDetail;
                }
                $order->order_code = 'ORD-OL' . $order->id;
                $order->total_amount = $totalOrder;
                $order->save();

                $vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
                $vnp_Returnurl = route('vnpay.ipn.guest');
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
    public function syncCart(Request $request)
    {
        $user = auth()->user(); // Lấy thông tin người dùng từ token
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $guestCart = $request->cart_items; // Lấy giỏ hàng từ request của khách vãng lai

        // if (!is_array($guestCart) || empty($guestCart)) {
        //     return response()->json(['message' => 'Cart is empty or invalid'], 400);
        // }

        foreach ($guestCart as $item) {
            $productId = $item['tb_product_id'];
            $variantId = $item['tb_variant_id'] ?? null; // Kiểm tra xem có variant không
            $quantity = $item['quantity'];

            // Lấy thông tin tồn kho của sản phẩm/variant
            $variant = tb_variant::find($variantId);
            if (!$variant) {
                return response()->json([
                    'message' => "Variant ID {$variantId} not found"
                ], 404);
            }
            $stockQuantity = $variant->quantity; // Số lượng tồn kho hiện tại

            // Kiểm tra xem sản phẩm đã có trong giỏ hàng của người dùng chưa
            $existingCartItem = tb_cart::where([
                ['user_id', '=', $user->id],
                ['tb_product_id', '=', $productId],
                ['tb_variant_id', '=', $variantId],
            ])->first();

            if ($existingCartItem) {
                // Cập nhật số lượng chính xác, cộng thêm từ giỏ hàng vãng lai
                $newQuantity = $existingCartItem->quantity = $item['quantity'];

                // Nếu tổng số lượng vượt quá tồn kho, chỉ cập nhật số lượng tối đa có thể thêm
                $actualQuantity = min($newQuantity, $stockQuantity);

                // Đảm bảo số lượng không bị cộng dồn sai
                tb_cart::where('id', $existingCartItem->id)->update([
                    'quantity' => $actualQuantity,
                    'updated_at' => now(),
                ]);
            } else {
                // Nếu chưa tồn tại, thêm mới nhưng đảm bảo không vượt tồn kho
                $actualQuantity = min($quantity, $stockQuantity);

                // Nếu chưa tồn tại, thêm mới
                tb_cart::insert([
                    'user_id' => $user->id,
                    'tb_product_id' => $productId,
                    'tb_variant_id' => $variantId,
                    'quantity' => $quantity,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            // Gửi thông báo nếu số lượng yêu cầu vượt tồn kho
            if ($item['quantity'] > $stockQuantity) {
                return response()->json([
                    'message' => "Sản phẩm '{$variant->name}' đã hết hàng trong kho. Chỉ {$stockQuantity} sản phẩm được thêm vào giỏ hàng.",
                    'product_id' => $productId,
                    'variant_id' => $variantId,
                    'available_quantity' => $stockQuantity,
                    'requested_quantity' => $quantity,
                ], 200);
            }
        }

        // Trả về giỏ hàng đã đồng bộ
        $syncedCart = tb_cart::where('user_id', $user->id)->get();
        return response()->json(['message' => 'Cart synced successfully', 'data' => $syncedCart], 200);
    }

}
