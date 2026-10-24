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
        Schema::table('services', function (Blueprint $table) {
            // Existing treatments were all shown under Trivandrum by the website, so keep that as the default
            $table->string('branch')->default('trivandrum')->after('category_name')->index(); // 'trivandrum', 'bangalore', 'both'
            $table->string('procedure_type')->default('cosmetic')->after('branch'); // 'dermatic' or 'cosmetic'
            $table->string('image_path')->nullable()->after('treats');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->dropIndex(['branch']);
            $table->dropColumn(['branch', 'procedure_type', 'image_path']);
        });
    }
};
