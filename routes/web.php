<?php

use App\Http\Controllers\CarController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Order\ShowController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CarDataController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('home');

// Заменяем существующий маршрут для главной страницы на использование контроллера IndexController
//Route::get('/', [App\Http\Controllers\Order\IndexController::class, '__invoke'])->name('welcome');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

//Route::middleware('auth')->group(function () {
//    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
//    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
//    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
//});
Route::middleware(['auth'])->group(function () {
    Route::get('/profile', [UserController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [UserController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [UserController::class, 'destroy'])->name('profile.destroy');

    Route::get('/profile/{user}', [ProfileController::class, 'show'])->name('profile.show');

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Добавляем маршрут для обновления пароля
    Route::put('/profile/password', [UserController::class, 'updatePassword'])->name('password.update');

    // Добавляем маршруты для добавления авто
    Route::get('/profile/add-car', [CarController::class, 'create'])->name('car.create');
    Route::post('/profile/add-car', [CarController::class, 'store'])->name('car.store');
    // Добавляем маршрут для удаления авто
    Route::delete('/profile/delete-car/{id}', [CarController::class, 'destroy'])->name('car.destroy');

    // Группа маршрутов заказов с пространством имен 'Order'
    Route::namespace('App\Http\Controllers\Order')->group(function () {
        Route::get('/orders', 'IndexController')->name('order.index');
        Route::get('/orders/create', 'CreateController')->name('order.create');
        Route::post('/orders', 'StoreController')->name('order.store');
        Route::get('/orders/{order}', 'ShowController')->name('order.show');
        Route::get('/orders/{order}/edit', 'EditController')->name('order.edit');
        Route::patch('/orders/{order}', 'UpdateController')->name('order.update');
        Route::delete('/orders/{order}', 'DestroyController')->name('order.destroy');

        Route::post('/orders/{order}/join', [ShowController::class, 'joinOrder'])->name('order.join');



        // Добавляем маршрут для всех поездок водителя
        Route::get('/driver/orders', 'IndexController@driverOrders')->name('driver.orders');
        // Добавляем маршрут для всех поездок пассажира
        Route::get('/passenger/orders', 'IndexController@passengerOrders')->name('passenger.orders');


        Route::get('/api/search/{query}', [CarDataController::class, 'search']);
        Route::get('/api/brands', [CarDataController::class, 'getBrands']);
        Route::get('/api/models/{brandId}', [CarDataController::class, 'getModels']);
        Route::get('/api/colors', [CarDataController::class, 'getColors']);

        // Маршрут для получения автомобилей текущего пользователя
        Route::get('/api/user/cars', function () {
            $user = auth()->user();
            $cars = $user->cars;  // Или $user->load('cars') для предварительной загрузки связей
            return response()->json($cars);
        })->name('user.cars');
    });
});

//Route::middleware(['auth', 'log.request'])->post('/orders', 'App\Http\Controllers\Order\StoreController')->name('order.store');

require __DIR__.'/auth.php';
