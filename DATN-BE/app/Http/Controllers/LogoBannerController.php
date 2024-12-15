<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use App\Models\tb_logo_banner;
use Illuminate\Support\Facades\Storage;
class LogoBannerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $logo_banner= tb_logo_banner::orderBy('id', direction: 'desc')->get(); // lấy logo_banner
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
    public function storeImage(Request $request)
    {
        try {
        //validate
        $request->validate([ 
            'name' => 'required|string|max:255', 
            'image' => 'required|image|mimes:jpg,jpeg,png,gif|max:2048', // Giới hạn kích thước ảnh tối đa là 2MB 
        ]);

        // Lưu ảnh vào thư mục storage/app/public/logo_banner
        $path = $request->file('image')->store('public/logo_banner');
        // Tạo đường dẫn tương đối để lưu vào database 
        $imagePath = str_replace('public/', '', $path);
        // Lưu thông tin vào database 
        $logoBanner = new tb_logo_banner(); 
        $logoBanner->name = $request->input('name'); 
        $logoBanner->image = $imagePath; 
        $logoBanner->save();
        
            return response()->json([ 
                'success' => true, 
                'message' => 'Ảnh đã được tải lên thành công!', 
                'data' => $logoBanner 
            ], 201);
        } catch (Exception $e) {
            return response()->json([ 
                'success' => false, 
                'message' => 'Có lỗi xảy ra, vui lòng thử lại sau!', 
                'error' => $e->getMessage() 
            ], 500); // 500 Internal Server Error
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        
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
    public function updateImage(Request $request, string $id)
    {
        try {
            // Validate dữ liệu đầu vào 
            $request->validate([ 
                'name' => 'required|string|max:255', 
                'image' => 'nullable|image|mimes:jpg,jpeg,png,gif|max:2048', // Giới hạn kích thước ảnh tối đa là 2MB, có thể không cần thiết 
            ]);
            // Tìm logo hoặc banner cần cập nhật 
            $logoBanner = tb_logo_banner::findOrFail($id);
            // Cập nhật tên 
            $logoBanner->name = $request->input('name');
            if ($request->hasFile('image')) { 
                // Xóa ảnh cũ nếu có 
                 if ($logoBanner->image) { 
                    $oldImagePath = 'public/' . $logoBanner->image;
                    if (Storage::exists($oldImagePath)) { 
                        Storage::delete($oldImagePath); 
                    } 
                }
                // Lưu ảnh mới vào thư mục storage/app/public/logo_banner 
                $path = $request->file('image')->store('public/logo_banner'); 
                // Tạo đường dẫn tương đối để lưu vào database 
                $imagePath = str_replace('public/', '', $path); 
                // Cập nhật đường dẫn ảnh mới 
                $logoBanner->image = $imagePath; 
            }
            // Lưu các thay đổi vào database 
            $logoBanner->save();
            return response()->json([ 
                'success' => true, 
                'message' => 'Thông tin và ảnh đã được cập nhật thành công!', 
                'data' => $logoBanner 
            ], 200); // 200 OK

        } catch (\Illuminate\Validation\ValidationException  $e) {
            return response()->json([ 
                'success' => false, 
                'message' => 'Dữ liệu đầu vào không hợp lệ!', 
                'errors' => $e->errors() 
            ], 422);
        } catch (\Exception $e) {
            // Xử lý các lỗi khác return 
            response()->json([ 
                'success' => false, 
                'message' => 'Có lỗi xảy ra, vui lòng thử lại sau!', 
                'error' => $e->getMessage() 
            ], 500); // 500 Internal Server Error
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
