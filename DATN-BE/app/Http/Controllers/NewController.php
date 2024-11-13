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
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'create_day' => 'required|date',
        ]);

        try {
            $news = tb_new::query()->create($request->all());
            return response()->json([
                'message' => 'Tạo mới bài viết thành công',
                'data' => $news
            ]);
        } catch (Exception $e) {
            return response()->json(['error' => 'Không thể tạo bài viết'], 500);
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
