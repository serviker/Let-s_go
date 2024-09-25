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
        Schema::create('streets', function (Blueprint $table) {
            $table->id();
            $table->string('street')->unique(); // Убедитесь, что поле уникально, если нужно
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('streets');
    }
};
