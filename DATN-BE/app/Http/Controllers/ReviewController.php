<?php

namespace App\Http\Controllers;

use App\Models\tb_oder;
use App\Models\tb_oderdetail;
use App\Models\tb_product;
use App\Models\tb_review;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    //
    public function index(Request $request, $product_id)
    {
        // Kiểm tra sản phẩm có tồn tại không
        $product = tb_product::find($product_id);

        if (!$product) {
            return response()->json([
                'message' => 'Sản phẩm không tồn tại.'
            ], 404); // Nếu sản phẩm không tồn tại
        }

        // Số lượng đánh giá mỗi trang (mặc định là 10, có thể lấy từ query string)
        $perPage = $request->input('per_page', 3);

        // Lấy danh sách đánh giá phân trang
        $reviews = tb_review::where('tb_product_id', $product_id)
            ->with('user') // Lấy thông tin người dùng đã đánh giá
            ->paginate($perPage); // Phân trang

        // Nếu không có đánh giá, trả về thông báo
        if ($reviews->isEmpty()) {
            return response()->json([
                'message' => 'Sản phẩm này chưa có đánh giá nào.'
            ], 200);
        }

        return response()->json($reviews, 200); // Trả về danh sách các đánh giá (bao gồm thông tin phân trang)
    }
    public function listAll()
    {
        $logo_banner= tb_review::with('product','user')->orderBy('id', 'desc')->get();
        return response()->json($logo_banner);
    }
    // thêm đánh giá
    public function store(Request $request)
    {
        // Validate dữ liệu nếu cần
        $validated = $request->validate([
            // 'user_id' => 'required|exists:users,id',
            'tb_product_id' => 'required|exists:tb_products,id',
            'order_id' => 'required|exists:tb_oders,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
        ]);

        // Kiểm tra trạng thái của đơn hàng
        $order = tb_oder::find($validated['order_id']);
        $orderDetail = tb_oderdetail::findOrFail($request->id);
        // Nếu không tìm thấy đơn hàng hoặc trạng thái không phải "đã hoàn thành", trả về lỗi
        if (!$order || $order->order_status !== 'Đã hoàn thành') {
            return response()->json([
                'message' => 'Đơn hàng phải ở trạng thái "đã hoàn thành" để có thể đánh giá sản phẩm.'
            ], 400); // Trả về lỗi nếu đơn hàng chưa hoàn thành
        }

        // Kiểm tra xem người dùng đã đánh giá sản phẩm này trong đơn hàng này chưa
        $existingReview = tb_review::where('user_id', auth()->id())  // Kiểm tra người dùng đã đánh giá chưa
            ->where('tb_product_id', $validated['tb_product_id'])
            ->where('order_id', $validated['order_id'])
            ->first();

        if ($existingReview) {
            return response()->json([
                'message' => 'Bạn đã đánh giá sản phẩm này trong đơn hàng này rồi.'
            ], 400); // Trả về lỗi nếu đã đánh giá trong cùng một đơn hàng
        }

        // Tạo mới review
        $review = tb_review::create([
            'user_id' => auth()->id(), // Lấy user_id của người dùng đã đăng nhập
            'tb_product_id' => $validated['tb_product_id'],
            'order_id' => $validated['order_id'],
            'rating' => $validated['rating'],
            'comment' => $validated['comment'],
        ]);

        // Cập nhật trạng thái is_reviewed
        $orderDetail->update([
            'is_reviewed' => true,
        ]);

        return response()->json($review, 201); // Trả về review mới
    }
    public function destroy(string $id) // xóa ảnh biến thể sản phẩm
    {
        try {
            $review = tb_review::findOrFail($id);

            $review->delete();

            return response()->json(['message' => 'xóa thành công'], 204);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'không tồn tại'], 404);
        } catch (Exception $e) {
            return response()->json(['error' => 'Lỗi xóa'], 500);
        }
    }
}
