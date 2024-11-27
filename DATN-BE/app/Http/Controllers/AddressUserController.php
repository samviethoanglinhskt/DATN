<?php

namespace App\Http\Controllers;

use App\Models\tb_address_user;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Exception;

class AddressUserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()//list địa chỉ của người dùng
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Người dùng không tồn tại',
                ], 404);
            }
            $address = tb_address_user::where('user_id', $user->id)->get();
            return response()->json([
                'success' => true,
                'message' => 'Hiển thị địa chỉ theo người dùng thành công',
                'data' => $address,
            ], 200); // 200 OK
        } catch (Exception $e) {
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

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)//thêm địa chỉ nhận hàng
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Người dùng không tồn tại',
                ], 404);
            }
            $address = tb_address_user::create([
                'user_id'=>$user->id,
                'address'=>$request->address,
                'address_detail'=>$request->address_detail
            ]);
            return response()->json([
                'success' => true,
                'message' => 'thêm địa chỉ theo người dùng thành công',
                'data' => $address,
            ], 200); // 200 OK
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Đã xảy ra lỗi!',
                'error' => $e->getMessage(),
            ], 500);
        }
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
    public function edit(string $id)//trả ra dữ liệu để sửa địa chỉ
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Người dùng không tồn tại',
                ], 404);
            }
            $address = tb_address_user::where('id', $id)->where('user_id', $user->id)->first();
            return response()->json([
                'success' => true,
                'message' => 'Hiển thị địa chỉ theo người dùng thành công',
                'data' => $address,
            ], 200); // 200 OK
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Đã xảy ra lỗi!',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {

            $address = tb_address_user::findOrFail($id);
            $address->address = $request->address;
            $address->address_detail = $request->address_detail;
            $address->save();
            return response()->json([
                'success' => true,
                'message' => 'Sửa địa chỉ theo người dùng thành công',
                'data' => $address,
            ], 200); // 200 OK
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Đã xảy ra lỗi!',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)//xóa địa chỉ người dùng
    {
        try {
            $address = tb_address_user::findOrFail($id);
            $address->delete();

            return response()->json([
                'message' => 'Xóa thành công',
                'data' => null
            ], 204);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Địa chỉ không tồn tại'], 404);
        } catch (Exception $e) {
            return response()->json(['error' => 'Không thể xóa địa chỉ'], 500);
        }
    }

    public function isDefaultAddress(Request $request){
        try {
            $user = JWTAuth::parseToken()->authenticate();
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Người dùng không tồn tại',
                ], 404);
            }

            $address = $user->address()->findOrFail($request->id);
            $user->address()->update(['is_default'=> false]);
            $address->update(['is_default' => true]);
            return response()->json([
                'success' => true,
                'message' => 'Thiết lập địa chỉ mặc định thành công',
                'data' => $address
            ], 204);
        } catch (Exception $e) {
            return response()->json(['success' => false,'error' => 'Không thể thiết lập mặc định địa chỉ'], 500);
        }
    }

}
