<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\tb_address_user;
use App\Http\Requests\RuleLogin;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Http\Requests\RuleRegister;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Http\Requests\RuleUpdateTaiKhoan;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index() // list tài khoản
    {
        $user = User::orderBy('id', 'desc')->get();
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
            $token = JWTAuth::fromUser($account);
            // Nếu đăng nhập thành công, trả về phản hồi thành công
            return response()->json([
                'success' => true,
                'message' => 'Đăng nhập thành công!',
                'data' => [
                    'account' => $account,
                    'token' => $token,
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
            // Bắt đầu transaction
            DB::beginTransaction();

            // Tạo người dùng mới
            $account = User::create([
                'name' => $request->name,
                'tb_role_id' => 2,
                'password' => Hash::make($request->password),
                'phone' => $request->phone,
                'email' => $request->email,
            ]);

            // Lưu địa chỉ người dùng vào bảng tb_address_users
            $address = tb_address_user::create([
                'user_id' => $account->id,
                'address' => $request->address,
                'address_detail' => $request->address_detail,
                'is_default' => true,
            ]);

            // Commit transaction
            DB::commit();
            // Trả về phản hồi thành công
            return response()->json([
                'success' => true,
                'message' => 'Đăng ký thành công!',
                'data' => [
                    'account' => $account,
                    'address' => $address,
                ]
            ], 201); // 201 Created
        } catch (\Exception $e) {
            Log::error('Registration error: ' . $e->getMessage());
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
            return response()->json([
                'success' => true,
                'message' => 'Đăng ký thành công!',
                'data' => $account
            ], 201);
        } catch (\Exception $e) {
            Log::error('Registration error: ' . $e->getMessage());
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
    public function showUser()
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Người dùng không tồn tại',
                ], 404);
            }
            $address = $user->address; // Loại bỏ địa chỉ khỏi đối tượng người dùng
            unset($user->address);
            return response()->json([
                'success' => true,
                'message' => 'Hiển thị thông tin người dùng thành công',
                'data' => ['user' => $user, 'address' => $address,],
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
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        try {
            $user = user::findOrFail($id);
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Người dùng không tồn tại',
                ], 404);
            }
            return response()->json([
                'success' => true,
                'message' => 'Hiển thị thông tin người dùng thành công',
                'data' => $user,
            ], 200); // 200 OK
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Đã xảy ra lỗi!',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    public function show(string $id)
    {
        try {
            $user = user::findOrFail($id);
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Người dùng không tồn tại',
                ], 404);
            }
            return response()->json([
                'success' => true,
                'message' => 'Hiển thị thông tin người dùng thành công',
                'data' => $user,
            ], 200); // 200 OK
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Đã xảy ra lỗi!',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function updateUser(RuleUpdateTaiKhoan $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Người dùng không tồn tại',
                ], 404);
            }
            // $user->update([
            //     'name' => $request->name,
            //     'tb_role_id' => $user->tb_role_id,
            //     'phone' => $request->phone,
            //     'email' => $request->email,
            //     'password' => $user->password,
            // ]);
            $user->name = $request->name;
            $user->phone = $request->phone;
            $user->email = $request->email;
            $user->save();

            return response()->json([
                'message' => 'Sửa thành công',
                'data' => $user
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Tài khoản không tồn tại'], 404);
        } catch (Exception $e) {
            Log::error('Registration error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Đã xảy ra lỗi!',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updatePassUser(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Người dùng không tồn tại',
                ], 404);
            }
            $account = User::where('email', $user->email)->first();

            // Kiểm tra xem tài khoản có tồn tại và mật khẩu có khớp không
            if (!$account || !Hash::check($request->current_password, $account->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Thông tin tài khoản không chính xác.',
                ], 401); // 401 Unauthorized
            }
            $account->password = $request->new_password;
            $account->save();

            return response()->json([
                'message' => 'Sửa thành công',
                'data' => $user
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Tài khoản không tồn tại'], 404);
        } catch (Exception $e) {
            Log::error('Registration error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Đã xảy ra lỗi!',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(RuleUpdateTaiKhoan $request, string $id)
    {
        try {
            $user = User::query()->findOrFail($id);
            $user->update([
                'tb_role_id' => $request->id,
            ]);

            return response()->json([
                'message' => 'Sửa thành công',
                'data' => $user
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Tài khoản không tồn tại'], 404);
        } catch (Exception $e) {
            Log::error('Registration error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Đã xảy ra lỗi!',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */


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
