<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('finances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            $table->string('chapitre');
            $table->decimal('dotation', 15, 2)->default(0);
            $table->decimal('engage', 15, 2)->default(0);
            $table->decimal('paye', 15, 2)->default(0);

            $table->timestamps();

            $table->index(['user_id', 'chapitre']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('finances');
    }
};

