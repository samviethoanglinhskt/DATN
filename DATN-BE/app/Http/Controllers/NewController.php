<?php

namespace App\Http\Controllers;

use App\Models\tb_new;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Storage;

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
        try {
            // Validate dữ liệu đầu vào
            $request->validate([
                'title' => 'required|string|max:255',
                'content' => 'required|string',
                'image' => 'required|image|max:2048',
            ]);

            // Xử lý ảnh
            $path = $request->file('image')->store('public/news');
            $imagePath = str_replace('public/', '', $path);

            // Tạo bài viết mới
            $new = tb_new::create([
                'title' => $request->title,
                'content' => $request->content,
                'create_day' => now(),
                'image' => $imagePath,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Tạo bài viết thành công!',
                'data' => $new,
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra, vui lòng thử lại sau!',
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
            // Validate dữ liệu đầu vào
            $request->validate([
                'title' => 'required|string|max:255',
                'content' => 'required|string',
                'image' => 'nullable|image|max:2048',
            ]);

            // Tìm bài viết cần cập nhật
            $news = tb_new::findOrFail($id);

            // Cập nhật tiêu đề và nội dung
            $news->title = $request->title;
            $news->content = $request->content;

            // Xử lý cập nhật ảnh (nếu có)
            if ($request->hasFile('image')) {
                if ($news->image) {
                    // Xóa ảnh cũ nếu có
                    $oldImagePath = 'public/' . $news->image;
                    if (Storage::exists($oldImagePath)) {
                        Storage::delete($oldImagePath);
                    }
                }

                // Lưu ảnh mới
                $path = $request->file('image')->store('public/news');
                $imagePath = str_replace('public/', '', $path);
                $news->image = $imagePath;
            }

            // Lưu thay đổi
            $news->save();

            return response()->json([
                'success' => true,
                'message' => 'Cập nhật bài viết thành công!',
                'data' => $news,
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Bài viết không tồn tại!',
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra, vui lòng thử lại sau!',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $news = tb_new::findOrFail($id);

            // Xóa ảnh nếu có
            if ($news->image) {
                $oldImagePath = 'public/' . $news->image;
                if (Storage::exists($oldImagePath)) {
                    Storage::delete($oldImagePath);
                }
            }

            // Xóa bài viết
            $news->delete();

            return response()->json([
                'success' => true,
                'message' => 'Xóa bài viết thành công!',
                'data' => null,
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Bài viết không tồn tại!',
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Không thể xóa bài viết, vui lòng thử lại sau!',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
