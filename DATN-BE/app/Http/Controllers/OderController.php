<?php

namespace App\Http\Controllers;

use App\Models\tb_oder;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\tb_oderdetail;

class OderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function listOderAdmin()
    {
        try {
            $oder = tb_oder::all();
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
                ->where('user_id', $user->id)
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
    public function update(Request $request, string $id)
    {
        try {
            $order = tb_oder::findOrFail($id);
            $order->order_status = $request->status;
            $order->save();
            return response()->json([
                'success' => true,
                'message' => 'Cập nhật trạng thái đơn hàng thành công',
                'order' => $order,
            ], 200);
        } catch (\Exception $e) {
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

    public function destroyOrder(Request $request)
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
            $order->order_status = 'Đã hủy đơn hàng';
            $order->feedback = $request->feedback;
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
}
