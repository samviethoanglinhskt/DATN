<?php

namespace App\Http\Controllers;

use App\Models\tb_oder;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\tb_oderdetail;
use App\Models\tb_variant;
use App\Events\OrderStatusUpdated;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Models\tb_discount;
class OderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function listOderAdmin()
    {
        try {
            $oder = tb_oder::orderBy('id', 'desc')->get();
            return response()->json([
                'success' => true,
                'message' => 'Hiển thị toàn bộ đơn hàng thành công',
                'data' => $oder,
            ], 200); // 200 OK
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Đã xảy ra lỗi!',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    public function listOderClient()
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Người dùng không tồn tại',
                ], 404);
            }
            $oder = tb_oder::with('oderDetails', 'oderDetails.product', 'oderDetails.variant', 'oderDetails.variant.size', 'oderDetails.variant.color', 'discount')
                ->where('user_id', $user->id)->orderByDesc('id')
                ->get();
            return response()->json([
                'success' => true,
                'message' => 'Hiển thị đơn hàng theo người dùng thành công',
                'data' => $oder,
            ], 200); // 200 OK
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Đã xảy ra lỗi!',
                'error' => $e->getMessage(),
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
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id) { 
        try { 
            // Bắt đầu transaction 
            DB::beginTransaction(); 
            // Khóa bi quan để ngăn ngừa cập nhật đồng thời 
            $order = tb_oder::where('id', $id)->lockForUpdate()->firstOrFail(); 
            // Kiểm tra trạng thái hiện tại của đơn hàng trước khi cập nhật 
            if ($order->order_status === 'Đã hủy') { 
                DB::rollBack(); 
                return response()->json([ 
                    'success' => false, 
                    'message' => 'Không thể cập nhật trạng thái đơn hàng vì đơn hàng đã bị hủy.', 
                ], 400); 
            } 
            // Nếu trạng thái là "Đã giao hàng", ghi nhận thời gian giao 
            if ($request->status === 'Đã giao hàng') { 
                $order->delivered_at = now(); 
            } 
            $order->order_status = $request->status; 
            $order->save(); 
            // Phát sóng sự kiện OrderStatusUpdated 
            broadcast(new OrderStatusUpdated($order, $order->user_id)); 
            // Ghi log thông tin cập nhật thành công 
            Log::info('Order status updated successfully.', ['order_id' => $order->id, 'status' => $order->order_status]); 
            // Hoàn thành transaction 
            DB::commit(); 
            return response()->json([ 
                'success' => true, 
                'message' => 'Cập nhật trạng thái đơn hàng thành công', 
                'order' => $order, 
            ], 200); 
            } catch (\Exception $e) { 
                // Rollback transaction nếu có lỗi 
                DB::rollBack(); 
                Log::error('Error updating order status: ' . $e->getMessage(), ['order_id' => $id]); 
                return response()->json([ 
                    'success' => false, 
                    'message' => 'Cập nhật trạng thái đơn hàng thất bại', 
                    'error' => $e->getMessage() 
                ], 500); 
            }
        }

    /**
     * Remove the specified resource from storage.
     */
    public function showOrderDetails($id)
    {
        try {
            $order = tb_oder::with('oderDetails.product', 'oderDetails.variant.size', 'oderDetails.variant.color')->findOrFail($id);
            return response()->json([
                'success' => true,
                'message' => 'Thông tin chi tiết đơn hàng',
                'order' => $order,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy đơn hàng',
                'error' => $e->getMessage()
            ], 404); // 404 Not Found 

        }
    }
    public function confirmOrder(Request $request)
    { // Hủy đơn hàng của người dùng
        try {
            $user = JWTAuth::parseToken()->authenticate();
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Người dùng không tồn tại',
                ], 404);
            }
            $order = tb_oder::where('id', $request->id)
                ->where('user_id', $user->id)
                ->first();
            if (!$order) {
                return response()->json([
                    'success' => false,
                    'message' => 'Đơn hàng không tồn tại',
                ], 404);
            }
            $order->order_status = 'Đã hoàn thành';
            $order->save();
            return response()->json([
                'success' => true,
                'message' => 'Đơn hàng đã thành công',
                'data' => $order,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Xác nhận đơn hàng thất bại',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function failOrder(Request $request)
    { // Hủy đơn hàng của người dùng
        try {
            $user = JWTAuth::parseToken()->authenticate();
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Người dùng không tồn tại',
                ], 404);
            }
            $order = tb_oder::where('id', $request->id)
                ->where('user_id', $user->id)
                ->first();
            if (!$order) {
                return response()->json([
                    'success' => false,
                    'message' => 'Đơn hàng không tồn tại',
                ], 404);
            }
            // Lấy danh sách chi tiết sản phẩm trong đơn hàng
            $orderDetails = tb_oderdetail::where('tb_oder_id', $order->id)->get();

            // Cập nhật số lượng sản phẩm
            foreach ($orderDetails as $detail) {
                $variant = tb_variant::find($detail->tb_variant_id);
                if ($variant) {
                    // Cộng lại số lượng sản phẩm
                    $variant->quantity += $detail->quantity;

                    // Kiểm tra trạng thái (nếu số lượng > 0 thì cập nhật thành "còn hàng")
                    if ($variant->quantity > 0) {
                        $variant->status = 'Còn hàng'; // Giả sử cột trạng thái là "status"
                    }

                    $variant->save();
                }
            }
            $order->order_status = 'Giao hàng thất bại';
            $order->feedback = $request->feedback;
            $order->save();
            return response()->json([
                'success' => true,
                'message' => 'Hoàn đơn hàng thành công',
                'data' => $order,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'hoàn đơn hàng thất bại',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    public function failAdminOrder(Request $request)
    { // Hủy đơn hàng của người dùng
        try {
            $order = tb_oder::where('id', $request->id)
                ->first();
            if (!$order) {
                return response()->json([
                    'success' => false,
                    'message' => 'Đơn hàng không tồn tại',
                ], 404);
            }
            // Lấy danh sách chi tiết sản phẩm trong đơn hàng
            $orderDetails = tb_oderdetail::where('tb_oder_id', $order->id)->get();

            // Cập nhật số lượng sản phẩm
            foreach ($orderDetails as $detail) {
                $variant = tb_variant::find($detail->tb_variant_id);
                if ($variant) {
                    // Cộng lại số lượng sản phẩm
                    $variant->quantity += $detail->quantity;

                    // Kiểm tra trạng thái (nếu số lượng > 0 thì cập nhật thành "còn hàng")
                    if ($variant->quantity > 0) {
                        $variant->status = 'Còn hàng'; // Giả sử cột trạng thái là "status"
                    }

                    $variant->save();
                }
            }
            $order->order_status = 'Giao hàng thất bại';
            $order->feedback = $request->feedback;
            $order->save();
            return response()->json([
                'success' => true,
                'message' => 'Hoàn đơn hàng thành công',
                'data' => $order,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'hoàn đơn hàng thất bại',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function destroyAdminOrder(Request $request)
    { // Hủy đơn hàng của người dùng
        try {
           
            $order = tb_oder::where('id', $request->id)
                ->first();
            if (!$order) {
                return response()->json([
                    'success' => false,
                    'message' => 'Đơn hàng không tồn tại',
                ], 404);
            }

            // Lấy danh sách chi tiết sản phẩm trong đơn hàng
            $orderDetails = tb_oderdetail::where('tb_oder_id', $order->id)->get();

            // Cập nhật số lượng sản phẩm
            foreach ($orderDetails as $detail) {
                $variant = tb_variant::find($detail->tb_variant_id);
                if ($variant) {
                    // Cộng lại số lượng sản phẩm
                    $variant->quantity += $detail->quantity;

                    // Kiểm tra trạng thái (nếu số lượng > 0 thì cập nhật thành "còn hàng")
                    if ($variant->quantity > 0) {
                        $variant->status = 'Còn hàng'; // Giả sử cột trạng thái là "status"
                    }

                    $variant->save();
                }
            }
            $discount = tb_discount::where( 'id',$order->tb_discount_id)->first();
            if ($discount) {
                $discount->quantity += 1;
                if ($discount->quantity <= 0) {
                    $discount->status = 'Hết Số Lượng';
                }else{
                    $discount->status = 'Còn Hàng';
                }
                $discount->save();
            } 
            $order->order_status = 'Đã hủy đơn hàng';
            $order->save();
            return response()->json([
                'success' => true,
                'message' => 'Hủy đơn hàng thành công',
                'data' => $order,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Hủy đơn hàng thất bại',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroyOrder(Request $request) { 
        try { 
            // Bắt đầu transaction 
            DB::beginTransaction(); 
            // Xác thực người dùng 
            $user = JWTAuth::parseToken()->authenticate(); 
            if (!$user) { 
                return response()->json([ 
                    'success' => false, 
                    'message' => 'Người dùng không tồn tại', 
                ], 404); 
            } 
            // Khóa bi quan để ngăn ngừa cập nhật đồng thời 
            $order = tb_oder::where('id', $request->id) 
            ->where('user_id', $user->id) 
            ->lockForUpdate() 
            ->first(); 
            if (!$order) { 
                DB::rollBack(); 
                return response()->json([ 
                    'success' => false, 
                    'message' => 'Đơn hàng không tồn tại', 
                ], 404); 
            } 
            // Kiểm tra trạng thái hiện tại của đơn hàng trước khi hủy 
            if ($order->order_status === 'Đã xử lý' || $order->order_status === 'Đang giao hàng' || $order->order_status === 'Đã giao hàng') { 
                DB::rollBack(); 
                return response()->json([ 
                    'success' => false, 
                    'message' => 'Không thể hủy đơn hàng vì trạng thái hiện tại của đơn hàng không cho phép.', 
                ], 400); 
            } 
            // Lấy danh sách chi tiết sản phẩm trong đơn hàng 
            $orderDetails = tb_oderdetail::where('tb_oder_id', $order->id)->get(); 
            // Cập nhật số lượng sản phẩm 
            foreach ($orderDetails as $detail) {
                $variant = tb_variant::find($detail->tb_variant_id); 
                if ($variant) { 
                    // Cộng lại số lượng sản phẩm 
                    $variant->quantity += $detail->quantity; 
                    // Kiểm tra trạng thái (nếu số lượng > 0 thì cập nhật thành "Còn hàng") 
                    if ($variant->quantity > 0) { 
                        $variant->status = 'Còn hàng'; // Giả sử cột trạng thái là "status" 
                    } 
                    $variant->save(); 
                } 
            }
            $discount = tb_discount::where( 'id',$order->tb_discount_id)->first();
            if ($discount) {
                $discount->quantity += 1;
                if ($discount->quantity <= 0) {
                    $discount->status = 'Hết Số Lượng';
                }else{
                    $discount->status = 'Còn Hàng';
                }
                $discount->save();
            }
            // Cập nhật trạng thái đơn hàng thành "Đã hủy đơn hàng" 
            $order->order_status = 'Đã hủy đơn hàng'; 
            $order->feedback = $request->feedback; 
            $order->save(); 
            // Phát sóng sự kiện OrderStatusUpdated 
            broadcast(new OrderStatusUpdated($order, $order->user_id)); 
            // Ghi log thông tin hủy đơn hàng thành công 
            Log::info('Order cancelled successfully.', ['order_id' => $order->id]); 
            // Hoàn thành transaction 
            DB::commit(); 
            return response()->json([ 
                'success' => true, 
                'message' => 'Hủy đơn hàng thành công', 
                'data' => $order, 
            ], 200); 
        } catch (\Exception $e) { 
            // Rollback transaction nếu có lỗi 
            DB::rollBack(); 
            Log::error('Error cancelling order: ' . $e->getMessage(), ['order_id' => $request->id]); 
            return response()->json([ 
                'success' => false, 
                'message' => 'Hủy đơn hàng thất bại', 
                'error' => $e->getMessage() 
            ], 500); 
        } 
    }
}
