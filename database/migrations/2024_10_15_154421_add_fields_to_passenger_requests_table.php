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
            $table->string('departure_city')->nullable()->after('passenger_id');
            $table->string('arrival_city')->nullable()->after('departure_city');
            $table->integer('seats')->nullable()->after('arrival_city');
        });
    }

    public function down()
    {
        Schema::table('passenger_requests', function (Blueprint $table) {
            $table->dropColumn(['departure_city', 'arrival_city', 'seats']);
        });
    }

};
