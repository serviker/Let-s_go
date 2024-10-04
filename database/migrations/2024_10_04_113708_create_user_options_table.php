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
        Schema::create('user_options', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id'); // Внешний ключ на пользователей
            $table->unsignedBigInteger('option_value_id'); // Внешний ключ на значения опций
            $table->timestamps();

            // Связи
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('option_value_id')->references('id')->on('option_values')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_options');
    }
};
