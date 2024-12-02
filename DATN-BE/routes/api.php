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
Route::resource('order', OderController::class);

//Route::apiResource('variants', VariantsController::class);
Route::apiResource('image', ImagesController::class);
Route::get('/product-new', [ProductController::class, 'getLatestProduct'])->name('product_new');
Route::get('/product-list', [ProductController::class, 'getListProduct'])->name('product_list');
Route::get('/product-top', [ProductController::class, 'getTopsellingProduct']);

Route::post('/register', [UserController::class, 'register'])->name('register');
Route::post('/login', [UserController::class, 'login'])->name('login');
Route::post('/fogot-pass', [UserController::class, 'forgotPass']);
Route::get('/show-user', [UserController::class, 'showUser'])->name('show_User');
Route::put('/update-user', [UserController::class, 'updateUser'])->name('update_User');
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
//vnpay
Route::get('/vnpay/ipn', [CartController::class, 'handleVnpayIpn'])->name('vnpay.ipn');
Route::post('/payment-online', [CartController::class, 'vnpay'])->name('payment.online');
Route::post('/payment-guest', [CartController::class, 'vnpay_guest'])->name('payment.guest');
//oder
Route::get('/list-oder-client', [OderController::class, 'listOderClient'])->name('list_oder_client');
Route::get('/list-oder-admin', [OderController::class, 'listOderAdmin'])->name('list_oder_admin');
Route::get('/show-oder-detail/{id}', [OderController::class, 'showOrderDetails'])->name('show_oder_detail');
Route::put('/destroy-order-client', [OderController::class, 'destroyOrder'])->name('destroy_order_client');

//contact
Route::get('/getByUser', [ContactController::class, 'getByUser'])->name('getByUser');

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

Route::post('/reviews', [ReviewController::class, 'store']);
// thống kê
// doanh thu  theo ngày, tháng , năm
Route::get('/statistics/revenue', [StatisticsController::class, 'revenueByDay']);
// top 10 sản phẩm bán chạy
Route::get('/statistics/top-selling-products', [StatisticsController::class, 'topSellingProductsByMonth']);
// tổng đơn hàng, tổng tài khoản, tỉ lệ thành công,hủy của đơn hàng
Route::get('/statistics/monthly', [StatisticsController::class, 'monthlyStatistics']);

