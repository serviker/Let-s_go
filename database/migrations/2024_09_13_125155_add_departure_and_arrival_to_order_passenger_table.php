<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('order_passenger', function (Blueprint $table) {
            $table->string('departure_city')->nullable()->after('passenger_id');  // Добавляем колонку для города отправления
            $table->string('arrival_city')->nullable()->after('departure_city');    // Добавляем колонку для города прибытия
        });
    }

    public function down()
    {
        Schema::table('order_passenger', function (Blueprint $table) {
            $table->dropColumn(['departure_city', 'arrival_city']);
        });
    }

};
