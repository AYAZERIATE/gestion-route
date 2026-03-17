<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Finance extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'chapitre',
        'dotation',
        'engage',
        'paye',
    ];

    protected $casts = [
        'dotation' => 'float',
        'engage' => 'float',
        'paye' => 'float',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

