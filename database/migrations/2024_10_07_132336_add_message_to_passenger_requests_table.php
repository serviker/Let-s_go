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
        Schema::table('passenger_requests', function (Blueprint $table) {
            $table->text('message')->nullable()->after('approved_at'); // Добавляем поле message после approved_at
        });
    }

    public function down()
    {
        Schema::table('passenger_requests', function (Blueprint $table) {
            $table->dropColumn('message'); // Удаляем поле при откате миграции
        });
    }
};
