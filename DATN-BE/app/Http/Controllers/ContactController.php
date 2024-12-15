<?php

namespace App\Http\Controllers;

use App\Models\tb_contact;
use Auth;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Validator;

class ContactController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $contact = tb_contact::orderBy('id', 'desc')->get();
        return response()->json($contact);
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
        try {

            $user = JWTAuth::parseToken()->authenticate();

            if ($user) {
                $contact = tb_contact::create([
                    'user_id' => $user->id,
                    'name' => $request->name,
                    'phone' => $request->phone,
                    'email' => $request->email,
                    'content' => $request->content,
                    'status' => 'Chưa xử lý'
                ]);
            }
            return response()->json([
                'message' => 'Tạo form liên hệ thành công',
                'data' => $contact
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'error' => 'Something went wrong: ' . $e->getMessage()
            ], 500);
        }
    }
    public function storeGuest(Request $request)
    {
        try {
            $contact = tb_contact::create([
                'user_id' => 1,
                'name' => $request->name,
                'phone' => $request->phone,
                'email' => $request->email,
                'content' => $request->content,
                'status' => 'Chưa xử lý'
            ]);

            return response()->json([
                'message' => 'Tạo form liên hệ thành công',
                'data' => $contact
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'error' => 'Something went wrong: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getByUser()
    {
        try {
            // Kiểm tra nếu người dùng đã đăng nhập (sử dụng JWT)
            $user = JWTAuth::parseToken()->authenticate();
            if (!$user) {
                return response()->json(['error' => 'Người dùng chưa đăng nhập'], 401);
            }

            // Lấy các liên hệ của người dùng
            $contacts = tb_contact::where('user_id', $user->id)->orderBy('id', 'desc')->get();

            return response()->json([
                'message' => 'Lấy dữ liệu thành công',
                'data' => $contacts
            ]);
        } catch (Exception $e) {
            return response()->json(['error' => 'Không thể tạo form liên hệ'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
        try {
            $contact = tb_contact::query()->findOrFail($id);
            return response()->json([
                'message' => 'Form liên hệ ' . $id,
                'data' => $contact
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Form liên hệ này không tồn tại'], 404);
        } catch (Exception $e) {
            return response()->json(['error' => 'Không thể lấy form liên hệ này'], 500);
        }
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
    public function update(String $id)
    {
        try {
            // Tìm form liên hệ theo ID
            $contact = tb_contact::findOrFail($id);

            // Cập nhật chỉ trường 'status'
            $contact->update([
                'status' => 'Đã xử lý',
            ]);

            return response()->json([
                'message' => 'Cập nhật trạng thái form liên hệ thành công',
                'data' => $contact
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy form liên hệ để cập nhật'], 404);
        } catch (Exception $e) {
            return response()->json(['error' => 'Không thể cập nhật form liên hệ'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        try {
            $contact = tb_contact::findOrFail($id);
            $contact->delete();

            return response()->json([
                'message' => 'Xóa form liên hệ thành công'
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy form liên hệ để xóa'], 404);
        } catch (Exception $e) {
            return response()->json(['error' => 'Không thể xóa form liên hệ'], 500);
        }
    }
}
