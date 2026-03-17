<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('marches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            $table->text('objet');
            $table->string('type')->index();
            $table->string('statut')->index();
            $table->decimal('montant', 15, 2)->default(0);
            $table->text('avancement')->nullable();
            $table->string('beneficiaire')->nullable();
            $table->string('loi_finance')->nullable();

            $table->timestamps();

            $table->index(['user_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('marches');
    }
};

