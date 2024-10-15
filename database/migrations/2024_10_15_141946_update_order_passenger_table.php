<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('order_passenger', function (Blueprint $table) {
            // Добавление нового столбца 'id' для уникальности записи
            $table->id()->first(); // Перемещаем ID в начало таблицы
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::table('order_passenger', function (Blueprint $table) {
            // Возврат изменений, если необходимо
            $table->dropColumn('id'); // Если вы добавили ID в up(), удаляем его здесь
        });
    }
};
