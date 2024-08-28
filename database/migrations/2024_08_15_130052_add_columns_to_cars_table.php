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
        Schema::table('cars', function (Blueprint $table) {

            $table->foreignId('brand_id')->nullable()->after('brand');
            $table->foreignId('model_id')->nullable()->after('model');
            // Установка внешних ключей
            $table->foreign('brand_id')->references('id')->on('car_brands')->onDelete('cascade');
            $table->foreign('model_id')->references('id')->on('car_brands')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cars', function (Blueprint $table) {
            // Удаление внешних ключей и полей
            $table->dropForeign(['brand_id']);
            $table->dropColumn('brand_id');
            $table->dropForeign(['model_id']);
            $table->dropColumn('model_id');
        });
    }
};
