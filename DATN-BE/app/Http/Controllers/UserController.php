<?php

namespace App\Http\Controllers;

use App\Models\tb_account;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Requests\RuleLogin;
use App\Http\Requests\RuleRegister;
use App\Models\User;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index() // list tài khoản
    {
        $user = User::all();
        return response()->json($user);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    public function login(RuleLogin $request)
    {
        try {
            // Tìm tài khoản theo email
            $account = User::where('email', $request->email)->first();

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
    public function register(RuleRegister $request)
    {
        try {
            // Tạo người dùng mới
            $account = User::create([
                'name' => $request->name,
                'tb_role_id' => 2,
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
            \Log::error('Registration error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Đã xảy ra lỗi!',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function forgotPass(Request $request)
    {
        $request->validate(['email' => 'required']);

        try {
            $newPassword = Str::random(6);
            $account = User::where('email', $request->email)->first();

            if (!$account) {
                return response()->json(['error' => 'người dùng không tồn tại'], 404);
            }
            $account->password = Hash::make($newPassword);
            $account->save();
            Mail::send('emails.password_reset', ['name' => $account->user_name, 'newPassword' => $newPassword], function ($message) use ($account) {
                $message->to($account->email)
                    ->subject('Thông tin mật khẩu mới');
            });
        } catch (\Exception $e) {
            //throw $th;
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
    public function destroy(string $id) // xóa tài khoản (thuộc quyền admin)
    {
        try {
            $user = User::findOrFail($id);
            $user->delete();

            return response()->json([
                'message' => 'Xóa thành công',
                'data' => null
            ], 204);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Tài khoản không tồn tại'], 404);
        } catch (Exception $e) {
            return response()->json(['error' => 'Không thể xóa tài khoản'], 500);
        }
    }
}
