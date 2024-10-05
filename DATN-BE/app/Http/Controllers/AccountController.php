<?php

namespace App\Http\Controllers;

use App\Http\Requests\RuleLogin;
use App\Http\Requests\RuleRegister;
use App\Models\tb_account;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AccountController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    public function login(RuleLogin $request){
        try {
            // Tìm tài khoản theo email
            $account = tb_account::where('email', $request->email)->first();
    
            // Kiểm tra xem tài khoản có tồn tại và mật khẩu có khớp không
            if (!$account || !Hash::check($request->password, $account->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Thông tin đăng nhập không chính xác.',
                ], 401); // 401 Unauthorized
            }
    
            // Nếu đăng nhập thành công, trả về phản hồi thành công
            return response()->json([
                'success' => true,
                'message' => 'Đăng nhập thành công!',
                'data' => [
                    'account' => $account,
                    // Có thể thêm thông tin khác nếu cần
                ]
            ], 200); // 200 OK
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Đã xảy ra lỗi!',
                'error' => $e->getMessage()
            ], 500); // 500 Internal Server Error
        }
    }
    public function register(RuleRegister $request){
        try {
            // Tạo người dùng mới
            $account = tb_account::create([
                'tb_role_id' => 2,
                'user_name' => $request->user_name,
                'password' => Hash::make($request->password),
                'phone' => $request->phone,
                'email' => $request->email,

            ]);

            // Trả về phản hồi thành công
            return response()->json([
                'success' => true,
                'message' => 'Đăng ký thành công!',
                'data' => [
                    'account' => $account,
                    // Có thể thêm thông tin khác nếu cần
                ]
            ], 201); // 201 Created
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Đã xảy ra lỗi!',
                'error' => $e->getMessage()
            ], 500);
        }
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
