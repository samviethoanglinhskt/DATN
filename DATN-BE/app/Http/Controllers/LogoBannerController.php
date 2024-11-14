<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use App\Models\tb_logo_banner;
class LogoBannerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $logo_banner= tb_logo_banner::all(); // lấy logo_banner
        return response()->json($logo_banner);
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
            'name' => 'required|string|max:255',
            'image' => 'required|string', 
            'created_at' => 'required|date'
        ]);

        try {
            $banner = tb_logo_banner::create($request->all());
            return response()->json([
                'message' => 'Tạo logo/banner thành công',
                'data' => $banner
            ]);
        } catch (Exception $e) {
            return response()->json(['error' => 'Không thể tạo logo/banner'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
        try {
            $banner = tb_logo_banner::findOrFail($id);
            return response()->json([
                'message' => 'Chi tiết logo/banner ' . $id,
                'data' => $banner
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Logo/banner không tồn tại'], 404);
        } catch (Exception $e) {
            return response()->json(['error' => 'Không thể lấy logo/banner'], 500);
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
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'image' => 'sometimes|required|string',
            'created_at' => 'sometimes|required|date'
        ]);

        try {
            $banner = tb_logo_banner::findOrFail($id);
            $banner->update($request->all());

            return response()->json([
                'message' => 'Cập nhật logo/banner thành công',
                'data' => $banner
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Logo/banner không tồn tại'], 404);
        } catch (Exception $e) {
            return response()->json(['error' => 'Không thể cập nhật logo/banner'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        try {
            $banner = tb_logo_banner::findOrFail($id);
            $banner->delete();

            return response()->json([
                'message' => 'Xóa logo/banner thành công',
                'data' => null
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Logo/banner không tồn tại'], 404);
        } catch (Exception $e) {
            return response()->json(['error' => 'Không thể xóa logo/banner'], 500);
        }
    }
}
