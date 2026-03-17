<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Marche extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'objet',
        'type',
        'statut',
        'montant',
        'avancement',
        'beneficiaire',
        'loi_finance',
    ];

    protected $casts = [
        'montant' => 'float',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

