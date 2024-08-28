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
        Schema::table('users', function (Blueprint $table) {
            $table->string('lastName')->nullable()->after('name');
            $table->string('phone')->nullable()->after('password');
            $table->string('photoUrl')->nullable()->after('phone');
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('lastName');
            $table->dropColumn('phone');
            $table->dropColumn('photoUrl');
            $table->dropSoftDeletes();
        });
    }
};
