<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\AddressUserController;
use App\Http\Controllers\Api\CategoryController as ApiCategoryController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ColorController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\Controller;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\NewController;
use App\Http\Controllers\OderController;
use App\Http\Controllers\DiscountController;
use App\Http\Controllers\ImagesController;
use App\Http\Controllers\LogoBannerController;
use App\Http\Controllers\Paymentcontroller;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\SizeController;
use App\Http\Controllers\StatisticsController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VariantsController;
use App\Http\Middleware\CheckAdmin;
use App\Http\Middleware\CheckEmployee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Tymon\JWTAuth\Facades\JWTAuth;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('isAdmin')->group(function () {
    // Middleware
    Route::apiResource('variants', VariantsController::class);
    // Không dùng Middleware
    Route::get('api/variants', [VariantsController::class, 'index'])->name('variants.index')->withoutMiddleware('isAdmin');
});
Route::resource('product', ProductController::class);
Route::resource('category', controller: CategoryController::class);
Route::resource('discount', DiscountController::class);
Route::resource('logobanner', LogoBannerController::class);
Route::resource('brand', BrandController::class);
Route::resource('users', UserController::class);
Route::resource('size', SizeController::class);
Route::resource('color', ColorController::class);
Route::resource('new', NewController::class);

//logo_banner
Route::resource('logo_banner', LogoBannerController::class);
Route::post('/upload-image', [LogoBannerController::class, 'storeImage'])->name('uploat_image');
Route::post('/update-image/{id}', [LogoBannerController::class, 'updateImage'])->name('update_image');
Route::resource('contact', ContactController::class);


//Route::apiResource('variants', VariantsController::class);
Route::apiResource('image', ImagesController::class);
Route::get('/product-new', [ProductController::class, 'getLatestProduct'])->name('product_new');
Route::get('/product-list', [ProductController::class, 'getListProduct'])->name('product_list');
Route::get('/product-top', [ProductController::class, 'getTopsellingProduct']);
Route::get('/cart/check-stock', [ProductController::class, 'checkStock']);//check số lượng trong giỏ hàng vãng lai

Route::post('/register', [UserController::class, 'register'])->name('register');
Route::post('/login', [UserController::class, 'login'])->name('login');
Route::post('/forgot_password', [UserController::class, 'forgotPass']);
Route::get('/show-user', [UserController::class, 'showUser'])->name('show_User');
Route::put('/update-user', [UserController::class, 'updateUser'])->name('update_User');
Route::put('/change-password', [UserController::class, 'updatePassUser'])->name('update_Pass_User');
//địa chỉ theo người dùng
Route::resource('address', AddressUserController::class);
Route::put('/address-default', [AddressUserController::class, 'isDefaultAddress'])->name('address_default');

Route::post('/add-cart', [CartController::class, 'addToCart'])->name('add_cart');
Route::post('/list-to-guest', [CartController::class, 'listToGuest'])->name('list_to_guest');
Route::get('/cart', [CartController::class, 'listCart'])->name('list_cart');
Route::delete('/cart/del-all-cart', [CartController::class, 'delAllCart'])->name('del_all_cart');
Route::post('/cart/update-quantity-cart', [CartController::class, 'updateQuantityCart'])->name('update_quantity_cart');
Route::post('/cart/up-quantity-cart', [CartController::class, 'upQuantityCart'])->name('update_quantity_cart');
Route::post('/cart/del-one-cart', [CartController::class, 'delOneCart'])->name('del_one_cart');
Route::post('/cart/check-out-cart', [CartController::class, 'checkoutCart'])->name('checkout');
Route::post('/cart/check-out-guest', [CartController::class, 'checkoutGuest'])->name('checkout_guest');
Route::post('/cart/sync', [CartController::class, 'syncCart'])->middleware('auth:api');//đồng bộ giỏ hàng vãng lai khi đăng nhập
Route::post('/cart/check-cart-stock', [CartController::class, 'checkCartStock']);//đồng bộ số lượng giỏ hàng của khách vãng lai với kho
Route::post('/cart/check-investory', [CartController::class, 'checkInvestory']);

//vnpay
Route::get('/vnpay/ipn', [CartController::class, 'handleVnpayIpn'])->name('vnpay.ipn');
Route::get('/vnpay/ipn/guest', [CartController::class, 'handleVnpayIpnGuest'])->name('vnpay.ipn.guest');
Route::post('/payment-online', [CartController::class, 'vnpay'])->name('payment.online');
Route::post('/payment-guest', [CartController::class, 'vnpay_guest'])->name('payment.guest');

// mua lại bằng vnpay
Route::post('/payment-reorder', [CartController::class, 'reOrder'])->name('payment.reorder');
Route::get('/vnpay/ipn/reorder', [CartController::class, 'handleVnpayIpnReOrder'])->name('vnpay.ipn.reorder');
//oder
Route::resource('order', OderController::class);
Route::get('/list-oder-client', [OderController::class, 'listOderClient'])->name('list_oder_client');
Route::get('/list-oder-admin', [OderController::class, 'listOderAdmin'])->name('list_oder_admin');
Route::get('/show-oder-detail/{id}', [OderController::class, 'showOrderDetails'])->name('show_oder_detail');
Route::put('/destroy-order-client', [OderController::class, 'destroyOrder'])->name('destroy_order_client');
Route::put('/confirm-order-client', [OderController::class, 'confirmOrder'])->name('confirm_order_client');
Route::put('/fail-order-client', [OderController::class, 'failOrder'])->name('fail_order_client');
Route::put('/destroy-order-admin', [OderController::class, 'destroyAdminOrder'])->name('destroy_order_admin');
Route::put('/fail-order-admin', [OderController::class, 'failAdminOrder'])->name('fail_order_admin');

//contact
Route::get('/list-all', [ContactController::class, 'index']);
Route::get('/getByUser', [ContactController::class, 'getByUser'])->name('getByUser');
Route::post('/add-contact', [ContactController::class, 'store']);
Route::post('/add-contact-guest', [ContactController::class, 'storeGuest']);
Route::post('/update-contact/{id}', [ContactController::class, 'update']);
Route::delete('/delete-contact/{id}', [ContactController::class, 'destroy']);
// product favorite
Route::middleware(['auth:api'])->group(function () {
    Route::get('/favorites', [FavoriteController::class, 'index']);
    Route::post('/favorites', [FavoriteController::class, 'store']);
    Route::delete('/favorites/{id}', [FavoriteController::class, 'destroy']);
});

// comments
Route::middleware('auth:api')->group(function () {
    // Route để tạo bình luận
    Route::post('comments', [CommentController::class, 'store']);

    // Route để lấy tất cả bình luận của một sản phẩm
    Route::get('products/{product_id}/comments', [CommentController::class, 'index']);

    // Route để lấy các bình luận trả lời của một bình luận
    Route::get('comments/{comment_id}/replies', [CommentController::class, 'showReplies']);
});

// review
Route::get('/reviews/product/{product_id}', [ReviewController::class, 'index']);
Route::get('/reviews-list', [ReviewController::class, 'listAll']);
Route::delete('/reviews-delete/{id}', [ReviewController::class, 'destroy']);
Route::post('/reviews', [ReviewController::class, 'store']);
// thống kê
// doanh thu  theo ngày, tháng , năm
Route::get('/statistics/revenue', [StatisticsController::class, 'revenueByDay']);
// top 10 sản phẩm bán chạy theo tuần, tháng, quý , năm
Route::get('/statistics/top-selling-products', [StatisticsController::class, 'topSellingProducts']);
// top 3 thương hiệu bán chạy theo tuần, tháng, quý , năm
Route::get('/statistics/top-brand', [StatisticsController::class, 'brandStatistics']);
// top 10 sản phẩm đánh giá cao theo tuần tháng quý năm
Route::get('/statistics/top-rate', [StatisticsController::class, 'topRatedProducts']);

Route::get('/statistics/monthly', [StatisticsController::class, 'monthlyStatistics']);

//tổng tài khoản theo tuần tháng quý năm
Route::get('/statistics/user', [StatisticsController::class, 'userStatistics']);
// tổng đơn hàng,  tỉ lệ thành công,hủy của đơn hàng theo ngày, tuần ,tháng , quý ,năm
Route::get('/statistics/order', [StatisticsController::class, 'orderStatistics']);

// api Realtime
Route::get('verify-token', function (Request $request) {
    try {
        $user = JWTAuth::parseToken()->authenticate();
        return response()->json(['user' => $user]);
    } catch (Exception $e) {
        return response()->json(['error' => 'Token không hợp lệ'], 401);
    }
});
