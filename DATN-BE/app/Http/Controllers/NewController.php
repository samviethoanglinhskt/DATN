<?php

namespace App\Http\Controllers;

use App\Models\tb_new;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class NewController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $new = tb_new::all();
        return response()->json($new);
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
        try {
            // Kiểm tra và xử lý ảnh chính (nếu có)
            if ($request->hasFile('image') && $request->file('image')->isValid()) {
                $imagePath = $request->file('image')->store('news', 'public'); 
            } else {
                return response()->json(['error' => 'Lỗi ảnh bài viết'], 400);
            }

            // Tạo bài viết mới
            $new = tb_new::query()->create([
                'title' => $request->title,
                'content' => $request->content,
                'status' => $request->status,
                'image' => $imagePath,
            ]);

            // Trả về phản hồi thành công
            return response()->json([
                'message' => 'Tạo bài viết thành công',
                'news' => $new,
            ], 201);

        } catch (Exception $e) {
            // Trả về lỗi nếu có ngoại lệ
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
        try {
            $news = tb_new::query()->findOrFail($id);
            return response()->json([
                'message' => 'Bài viết ' . $id,
                'data' => $news
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Bài viết không tồn tại'], 404);
        } catch (Exception $e) {
            return response()->json(['error' => 'Không thể lấy bài viết'], 500);
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
        try {
            $news = tb_new::query()->findOrFail($id);
            $news->update([
                'title' => $request->title,
                'content' => $request->content,
                'create_day' => $request->create_day,
            ]);

            return response()->json([
                'message' => 'Cập nhật thành công',
                'data' => $news
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Bài viết không tồn tại'], 404);
        } catch (Exception $e) {
            return response()->json(['error' => 'Không thể cập nhật bài viết'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        try {
            $news = tb_new::query()->findOrFail($id);
            $news->delete();

            return response()->json([
                'message' => 'Xóa thành công',
                'data' => null
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Bài viết không tồn tại'], 404);
        } catch (Exception $e) {
            return response()->json(['error' => 'Không thể xóa bài viết'], 500);
        }
    }
}
