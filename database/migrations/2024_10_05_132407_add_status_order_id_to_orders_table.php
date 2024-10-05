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
        Schema::table('orders', function (Blueprint $table) {
            $table->foreignId('status_order_id')
                ->default(1)  // Мгновенное бронирование по умолчанию
                ->constrained('status_orders')
                ->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['status_order_id']);
            $table->dropColumn('status_order_id');
        });
    }

};
