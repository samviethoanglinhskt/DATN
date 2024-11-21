<?php

namespace App\Http\Controllers;

use App\Models\tb_comment;
use Exception;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class CommentController extends Controller
{
    public function store(Request $request)
    {
        try {
            // Kiểm tra người dùng đã được xác thực qua JWT chưa
            $user = JWTAuth::parseToken()->authenticate();

            // Kiểm tra hợp lệ các trường trong request
            $request->validate([
                'tb_product_id' => 'required|exists:tb_products,id',
                'content' => 'required|string|max:1000',
                'rating' => 'nullable|integer|min:1|max:5',
                'parent_id' => 'nullable|exists:tb_comments,id', // Nếu có parent_id, phải là id hợp lệ
            ]);
            $oders = $user->oders;
            $check = false;
            foreach($oders ?? [] as $oder){
                if ($oder->order_status === 'Đã giao hàng') {               
                    foreach($oder->oderDetails ?? [] as $oder_detail){
                        if ($oder_detail->tb_product_id == $request->tb_product_id) {
                            $check = true;
                            break 2;
                        }
                    }
                }
            }
            if (!$check) {
                return response()->json([
                    'error' => 'Bạn chỉ có thể bình luận sau khi đã mua và nhận sản phẩm.',
                ], 403);
            }
            // Tạo bình luận mới
            $comment = tb_comment::create([
                'user_id' => $user->id,
                'tb_product_id' => $request->tb_product_id,
                'content' => $request->content,
                'rating' => $request->rating ?? null,
                'parent_id' => $request->parent_id ?? null,
            ]);

            return response()->json([
               'data' => $comment,
            ], 201);  // Trả về bình luận vừa tạo với mã 201

        } catch (Exception $e) {
            return response()->json([
                'error' => 'Lỗi khi tạo bình luận. Vui lòng thử lại.',
                'message' => $e->getMessage(),
                'code' => $e->getCode()
            ], 500);
        }
    }
    // all bình luận theo sản phẩm
    public function index($tb_product_id)
    {
        try {
            // Lấy tất cả bình luận cho sản phẩm, bao gồm bình luận gốc và bình luận trả lời
            $comments = tb_comment::with('user', 'replies.user')
                ->where('tb_product_id', $tb_product_id)
                ->whereNull('parent_id')
                ->get();

            return response()->json($comments);
        } catch (Exception $e) {
            return response()->json([
                'error' => 'Lỗi khi lấy bình luận. Vui lòng thử lại.',
                'message' => $e->getMessage(),
                'code' => $e->getCode()
            ], 500);
        }
    }

    // Hàm lấy các bình luận trả lời của một bình luận
    public function showReplies($comment_id)
    {
        try {
            // Lấy bình luận và các bình luận trả lời của nó
            $comment = tb_comment::with('replies.user')->findOrFail($comment_id);

            return response()->json($comment->replies);
        } catch (Exception $e) {
            return response()->json([
                'error' => 'Lỗi khi lấy bình luận trả lời. Vui lòng thử lại.',
                'message' => $e->getMessage(),
                'code' => $e->getCode()
            ], 500);  // Trả về lỗi 500 cho lỗi server
        }
    }
}
