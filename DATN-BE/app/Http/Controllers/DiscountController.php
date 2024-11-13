<?php

namespace App\Http\Controllers;
use App\Models\tb_discount;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class DiscountController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $discount= tb_discount::all(); // lấy mã giảm giá
        return response()->json($discount);
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
            'discount_code' => 'required|string|max:50',
            'discount_value' => 'required|numeric',
            'name' => 'required|string|max:255',
            'start_day' => 'required|date',
            'end_day' => 'required|date|after_or_equal:start_day'
        ]);

        try {
            $discount = tb_discount::create($request->all());
            return response()->json([
                'message' => 'Tạo mới mã giảm giá thành công',
                'data' => $discount
            ]);
        } catch (Exception $e) {
            return response()->json(['error' => 'Không thể tạo mã giảm giá'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
        try {
            $discount = tb_discount::findOrFail($id);
            return response()->json([
                'message' => 'Thông tin mã giảm giá ' . $id,
                'data' => $discount
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Mã giảm giá không tồn tại'], 404);
        } catch (Exception $e) {
            return response()->json(['error' => 'Không thể lấy mã giảm giá'], 500);
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
            'discount_code' => 'sometimes|required|string|max:50',
            'discount_value' => 'sometimes|required|numeric',
            'name' => 'sometimes|required|string|max:255',
            'start_day' => 'sometimes|required|date',
            'end_day' => 'sometimes|required|date|after_or_equal:start_day'
        ]);

        try {
            $discount = tb_discount::findOrFail($id);
            $discount->update($request->all());

            return response()->json([
                'message' => 'Cập nhật mã giảm giá thành công',
                'data' => $discount
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Mã giảm giá không tồn tại'], 404);
        } catch (Exception $e) {
            return response()->json(['error' => 'Không thể cập nhật mã giảm giá'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        try {
            $discount = tb_discount::findOrFail($id);
            $discount->delete();

            return response()->json([
                'message' => 'Xóa mã giảm giá thành công',
                'data' => null
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Mã giảm giá không tồn tại'], 404);
        } catch (Exception $e) {
            return response()->json(['error' => 'Không thể xóa mã giảm giá'], 500);
        }
    }
}
