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
        Schema::create('to_addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('address_id')->constrained('addresses')->onDelete('cascade');
            $table->timestamps();
            $table->foreign('id')->references('id')->on('addresses')->onDelete('cascade');

            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('to_addresses');
    }
};
