<?php

namespace App\Http\Controllers;
use App\Models\tb_size;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class SizeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $size = tb_size::all(); //lấy thương hiệu
        return response()->json($size);
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
        $size = tb_size::query()->create($request->all());
        try {
            return response()->json([
                'message' => 'Tạo mới dung tích thành công',
                'data' => $size
            ]);
        } catch (Exception $e) {
            return response()->json(['error' => 'Không thể tạo dung tích'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
        try {
            $size = tb_size::query()->findOrFail($id);
            return response()->json([
                'message' => 'Dung tích ' . $id,
                'data' => $size
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Dung tích không tồn tại'], 404);
        } catch (Exception $e) {
            return response()->json(['error' => 'Không thể lấy dung tích'], 500);
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
            $size = tb_size::query()->findOrFail($id);

            $size->update([
                'name' => $request->name,
            ]);

            return response()->json([
                'message' => 'Sửa thành công',
                'data' => $size
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Dung tích không tồn tại'], 404);
        } catch (Exception $e) {
            return response()->json(['error' => 'Không thể cập nhật dung tích'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        try {
            $size = tb_size::findOrFail($id);
            $size->delete();

            return response()->json([
                'message' => 'Xóa thành công',
                'data' => null
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Dung tích không tồn tại'], 404);
        } catch (Exception $e) {
            return response()->json(['error' => 'Không thể xóa dung tích'], 500);
        }
    }
}
