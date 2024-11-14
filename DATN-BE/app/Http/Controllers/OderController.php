<?php

namespace App\Http\Controllers;

use App\Models\tb_oder;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

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
        }catch (\Exception $e) {
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
            $oder = tb_oder::with('oderDetails', 'oderDetails.product', 'oderDetails.variant',)
                ->where('user_id', $user->id)
                ->get();
            return response()->json([
                'success' => true,
                'message' => 'Hiển thị đơn hàng theo người dùng thành công',
                'data' => $oder,
            ], 200); // 200 OK
        }catch (\Exception $e) {
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
