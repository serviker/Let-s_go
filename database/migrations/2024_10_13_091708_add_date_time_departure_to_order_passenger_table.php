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
            $table->timestamp('date_time_departure')->nullable()->after('seats');;
        });
    }

    public function down()
    {
        Schema::table('order_passenger', function (Blueprint $table) {
            $table->dropColumn('date_time_departure');
        });
    }

};
