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
        Schema::create('cars', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('brand');
            $table->string('model');
            $table->string('color');
            $table->string('photoUrl')->nullable();
            $table->timestamps();

            $table->softDeletes();


            $table->index('user_id', 'car_user_idx');
            $table->foreign('user_id', 'car_user_fk')->on('users')->references('id');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cars');
    }
};
