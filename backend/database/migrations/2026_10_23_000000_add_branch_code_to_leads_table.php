<?php

use App\Models\Lead;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('leads', function (Blueprint $table) {
            $table->string('branch_code')->nullable()->after('branch')->index(); // 'trivandrum' or 'bangalore'
        });

        // Backfill existing leads from their free-text branch label
        DB::table('leads')->select('id', 'branch')->orderBy('id')->each(function ($lead) {
            DB::table('leads')->where('id', $lead->id)->update([
                'branch_code' => Lead::branchCodeFor($lead->branch),
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('leads', function (Blueprint $table) {
            $table->dropIndex(['branch_code']);
            $table->dropColumn('branch_code');
        });
    }
};
