<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\Api\CategoryController as ApiCategoryController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\Controller;
use App\Http\Controllers\DiscountController;
use App\Http\Controllers\ImagesController;
use App\Http\Controllers\LogoBannerController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SizeController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VariantsController;
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

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::resource('product', ProductController::class);
Route::resource('category', controller: CategoryController::class);
Route::resource('discount', DiscountController::class);
Route::resource('logobanner', LogoBannerController::class);
Route::resource('brand', BrandController::class);
Route::resource('users', UserController::class);
Route::resource('size', SizeController::class);

Route::apiResource('variants', VariantsController::class);
Route::apiResource('image', ImagesController::class);
Route::get('/product_new', [ProductController::class, 'getLatestProduct'])->name('product_new');
Route::get('/product-list', [ProductController::class, 'getListProduct'])->name('product_list');

Route::post('/register', [UserController::class, 'register'])->name('register');
Route::post('/login', [UserController::class, 'login'])->name('login');
Route::post('/fogot-pass', [UserController::class, 'forgotPass']);
