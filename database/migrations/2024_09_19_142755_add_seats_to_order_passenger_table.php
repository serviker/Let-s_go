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
            $table->integer('seats')->nullable()->after('arrival_city');  // Добавляем колонку для количества мест
        });
    }

    public function down()
    {
        Schema::table('order_passenger', function (Blueprint $table) {
            $table->dropColumn('seats');
        });
    }

};
