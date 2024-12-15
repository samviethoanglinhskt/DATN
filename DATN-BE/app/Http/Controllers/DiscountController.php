<?php

namespace App\Http\Controllers;
use App\Models\tb_discount;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class DiscountController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $discounts = tb_discount::where('quantity', '>', 0)->orderBy('id', 'desc')->get(); // Thêm điều kiện lọc
        return response()->json($discounts);
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
            $request->validate([ 
                'discount_code' => 'required|string|max:255', 
                'discount_value' => 'required|numeric', 
                'quantity' => 'required|integer', 
                'max_price' => 'required|numeric', 
                'name' => 'required|string|max:255', 
                'start_day' => 'required|date', 
                'end_day' => 'required|date', 
            ]);
            $discount = new tb_discount(); 
            $discount->discount_code = $request->discount_code; 
            $discount->discount_value = $request->discount_value; 
            $discount->quantity = $request->quantity; 
            $discount->max_price = $request->max_price; 
            $discount->name = $request->name; 
            $discount->start_day = $request->start_day; 
            $discount->end_day = $request->end_day; 
            $discount->save();
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
        try { 
            $request->validate([ 
                'discount_code' => 'required|string|max:255', 
                'discount_value' => 'required|numeric', 
                'quantity' => 'required|integer', 
                'max_price' => 'required|numeric', 
                'name' => 'required|string|max:255', 
                'start_day' => 'required|date', 
                'end_day' => 'required|date', 
            ]); 
            $discount = tb_discount::find($id); 
            if (!$discount) { 
                return response()->json([
                    'success' => false, 
                    'message' => 'Giảm giá không tồn tại'
                ], 404); 
            } 
            $discount->discount_code = $request->discount_code; 
            $discount->discount_value = $request->discount_value; 
            $discount->quantity = $request->quantity; 
            $discount->max_price = $request->max_price;
            $discount->name = $request->name; 
            $discount->start_day = $request->start_day; 
            $discount->end_day = $request->end_day; 
            $discount->save(); 
            return response()->json([
                'success' => true, 
                'message' => 'Cập nhật giảm giá thành công', 
                'data' => $discount
            ], 200); 
            } catch (\Exception $e) { 
                Log::error('Error updating discount: ' . $e->getMessage()); 
                return response()->json([
                    'success' => false, 
                    'message' => 'Cập nhật giảm giá thất bại', 
                    'error' => $e->getMessage()
                ], 500); 
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
