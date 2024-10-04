<?php

use App\Http\Controllers\CarController;
use App\Http\Controllers\CityController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Message\CreateController;
use App\Http\Controllers\Message\StoreController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\Order\ShowController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StreetController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\OptionController;
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

    // Добавляем маршруты для добавления авто
    Route::get('/profile/add-car', [CarController::class, 'create'])->name('car.create');
    Route::post('/profile/add-car', [CarController::class, 'store'])->name('car.store');
    // Добавляем маршрут для удаления авто
    Route::delete('/profile/delete-car/{id}', [CarController::class, 'destroy'])->name('car.destroy');

    // Маршрут для уведомлений
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index'); // Это маршрут для страницы уведомлений

    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy'])->name('notifications.destroy');
    Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount'])->name('notifications.unreadCount');

    // маршруты для управления опциями
    Route::get('/options', [OptionController::class, 'index'])->name('options.index');

    Route::post('/api/saveOptions/{userId}', [OptionController::class, 'saveOptions']);

    Route::post('/options', [OptionController::class, 'store']);
    Route::put('/options/{id}', [OptionController::class, 'update']);
    Route::delete('/options/{id}', [OptionController::class, 'destroy']);

    // Route::get('/profile/{user}', [ProfileController::class, 'show'])->name('profile.show');
    // Маршрут для профиля водителя
    Route::get('/profile/driver/{user}', [ProfileController::class, 'showDriver'])->name('profile.showDriver');

    // Маршрут для профиля пассажира
    Route::get('/profile/passenger/{user}', [ProfileController::class, 'showPassenger'])->name('profile.showPassenger');

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Добавляем маршрут для обновления пароля
    Route::put('/profile/password', [UserController::class, 'updatePassword'])->name('password.update');

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/api/cities', [CityController::class, 'getCities']);
    Route::get('/api/colors', [CityController::class, 'getColors']);
    Route::get('/api/suggestions', [CityController::class, 'getSuggestions']);
    Route::get('/api/search/{query}', [CityController::class, 'search']);

    Route::get('/api/streets', [StreetController::class, 'getStreets']);
    Route::get('/api/street-suggestions', [StreetController::class, 'getSuggestions']);

    // Группа маршрутов заказов с пространством имен 'Message'
    Route::namespace('App\Http\Controllers\Message')->group(function () {
        // Route to show the user's incoming trips
        Route::get('/incoming', [\App\Http\Controllers\Message\ShowController::class, 'showIncoming'])->name('incoming.show');
        Route::get('/orders/{order}/messages/create', CreateController::class)->name('messages.create');
       // Route::post('/orders/{order}/messages', StoreController::class)->name('messages.store');
        Route::post('/orders/{order}/messages', [StoreController::class, '__invoke'])->name('messages.store');

        // In your web.php or api.php
        Route::get('/orders/{order}/messages/{userId}', 'ShowController')->name('messages.show');

    });

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

        Route::delete('/orders/{order}/cancel/passenger', [ShowController::class, 'cancelOrderPassenger'])->name('order.cancel');
        Route::delete('/orders/{order}/cancel/driver', [ShowController::class, 'cancelOrderDriver'])->name('order.cancelForDriver');



        // Добавляем маршрут для всех поездок водителя
        Route::get('/driver/orders', 'IndexController@driverOrders')->name('driver.orders');
        // Добавляем маршрут для всех поездок пассажира
        Route::get('/passenger/orders', 'IndexController@passengerOrders')->name('passenger.orders');
        Route::get('/passenger/search', 'IndexController@ordersPassenger')->name('passenger.search');

        Route::get('/api/user/{user}/booked-trips', [UserController::class, 'checkBookedTrips']);

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
