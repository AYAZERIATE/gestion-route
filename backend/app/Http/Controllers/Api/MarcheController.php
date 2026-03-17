<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Marche;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MarcheController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $marches = Marche::query()
            ->where('user_id', $request->user()->id)
            ->orderByDesc('id')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'marches' => $marches,
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'objet' => ['required', 'string'],
            'type' => ['required', 'string', 'max:255'],
            'statut' => ['required', 'string', 'max:255'],
            'montant' => ['nullable', 'numeric', 'min:0'],
            'avancement' => ['nullable', 'string'],
            'beneficiaire' => ['nullable', 'string', 'max:255'],
            'loi_finance' => ['nullable', 'string', 'max:255'],
        ]);

        $marche = Marche::create([
            'user_id' => $request->user()->id,
            ...$validated,
            'montant' => $validated['montant'] ?? 0,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Marche created.',
            'data' => [
                'marche' => $marche,
            ],
        ], 201);
    }

    public function show(Request $request, Marche $marche): JsonResponse
    {
        if ($marche->user_id !== $request->user()->id) abort(403);

        return response()->json([
            'success' => true,
            'data' => [
                'marche' => $marche,
            ],
        ]);
    }

    public function update(Request $request, Marche $marche): JsonResponse
    {
        if ($marche->user_id !== $request->user()->id) abort(403);

        $validated = $request->validate([
            'objet' => ['sometimes', 'string'],
            'type' => ['sometimes', 'string', 'max:255'],
            'statut' => ['sometimes', 'string', 'max:255'],
            'montant' => ['sometimes', 'numeric', 'min:0'],
            'avancement' => ['sometimes', 'nullable', 'string'],
            'beneficiaire' => ['sometimes', 'nullable', 'string', 'max:255'],
            'loi_finance' => ['sometimes', 'nullable', 'string', 'max:255'],
        ]);

        $marche->fill($validated);
        $marche->save();

        return response()->json([
            'success' => true,
            'message' => 'Marche updated.',
            'data' => [
                'marche' => $marche,
            ],
        ]);
    }

    public function destroy(Request $request, Marche $marche): JsonResponse
    {
        if ($marche->user_id !== $request->user()->id) abort(403);

        $marche->delete();

        return response()->json([
            'success' => true,
            'message' => 'Marche deleted.',
        ]);
    }
}

