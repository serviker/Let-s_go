<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
        public function up()
    {
        // Отключаем проверки внешних ключей
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // Создаем новую временную таблицу с нужным порядком столбцов
        Schema::create('orders', function (Blueprint $table) {
            $table->id();

            // Дата и время отправления
            $table->timestamp('date_time_departure');

            // Внешние ключи
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Создатель заказа (обычно водитель)
            $table->foreignId('from_address_id')->constrained('addresses')->onDelete('cascade'); // Отправной адрес
            $table->foreignId('to_address_id')->constrained('addresses')->onDelete('cascade'); // Конечный адрес
            $table->foreignId('driver_id')->constrained('users')->onDelete('cascade'); // Водитель
            $table->foreignId('status_order_id')->constrained('status_orders'); // Статус заказа (не добавляем default здесь)

            // Поля для описания заказа
            $table->decimal('price', 10, 2); // Цена
            $table->integer('available_seats'); // Количество доступных мест
            $table->text('description')->nullable(); // Описание поездки

            // Пассажир (если один, иначе нужно переделать логику)
            $table->foreignId('passenger_id')->nullable()->constrained('users')->onDelete('cascade');

            // Временные метки
            $table->timestamps(); // created_at, updated_at
            $table->softDeletes(); // deleted_at

            // Индексы (ускоряют запросы)
            $table->index('from_address_id');
            $table->index('to_address_id');
            $table->index('status_order_id');
        });

        // Удаляем старую таблицу
//        Schema::dropIfExists('orders');
//
//        // Переименовываем временную таблицу в оригинальное имя
//        Schema::rename('temp_orders', 'orders');

        // Включаем проверки внешних ключей обратно
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }

        public function down()
    {
        // Отключаем проверки внешних ключей
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        // Откат миграции (не обязательно, если нет данных)
        Schema::dropIfExists('orders');

        // Восстанавливаем прежнюю структуру (если это необходимо)
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->timestamp('date_time_departure');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('from_address_id')->constrained()->onDelete('cascade');
            $table->foreignId('to_address_id')->constrained()->onDelete('cascade');
            $table->foreignId('driver_id')->constrained()->onDelete('cascade');
            $table->decimal('price', 10, 2);
            $table->integer('available_seats');
            $table->foreignId('status_order_id')->constrained('status_orders')->default(1);
            $table->text('description')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
        // Включаем проверки внешних ключей обратно
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
};
