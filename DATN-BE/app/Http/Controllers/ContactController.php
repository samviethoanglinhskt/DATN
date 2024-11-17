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
        $contact = tb_contact::all();
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
         // Validation
         $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:15',
            'email' => 'required|email|max:255',
            'content' => 'required|string',
            'status' => 'required|string|in:new,chờ xử lý,đã đọc', // Đảm bảo status hợp lệ
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        try {
            // Kiểm tra xem người dùng đã đăng nhập không (sử dụng JWT)
            $user = JWTAuth::parseToken()->authenticate();
            
            // Nếu người dùng không đăng nhập, tạo liên hệ mà không cần user_id
            if (!$user) {
                $contact = tb_contact::create([
                    'name' => $request->name,
                    'phone' => $request->phone,
                    'email' => $request->email,
                    'content' => $request->content,
                    'status' => $request->status
                ]);
            } else {
                // Nếu người dùng đã đăng nhập, lấy user_id
                $user_id = $user->id;

                $contact = tb_contact::create([
                    'user_id' => $user_id,
                    'name' => $request->name,
                    'phone' => $request->phone,
                    'email' => $request->email,
                    'content' => $request->content,
                    'status' => $request->status
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


    public function getByUser(Request $request)
    {
        try {
            // Kiểm tra nếu người dùng đã đăng nhập (sử dụng JWT)
            $user = JWTAuth::parseToken()->authenticate();
            if (!$user) {
                return response()->json(['error' => 'Người dùng chưa đăng nhập'], 401);
            }

            // Lấy các liên hệ của người dùng
            $contacts = tb_contact::where('user_id', $user->id)->get();

            return response()->json([
                'message' => 'Lấy dữ liệu thành công',
                'user' => [
                    'name' => $user->name,
                    'phone' => $user->phone,
                    'email' => $user->email
                ],
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
    public function update(Request $request, string $id)
    {
        //
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:new,chờ xử lý, đã đọc',  // chỉ kiểm tra trạng thái
        ]);
    
        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }
    
        try {
            // Tìm form liên hệ theo ID
            $contact = tb_contact::findOrFail($id);
    
            // Cập nhật chỉ trường 'status'
            $contact->update([
                'status' => $request->status,
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
