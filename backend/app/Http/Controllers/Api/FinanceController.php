<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Finance;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FinanceController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $finances = Finance::query()
            ->where('user_id', $request->user()->id)
            ->orderByDesc('id')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'finances' => $finances,
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'chapitre' => ['required', 'string', 'max:255'],
            'dotation' => ['nullable', 'numeric', 'min:0'],
            'engage' => ['nullable', 'numeric', 'min:0'],
            'paye' => ['nullable', 'numeric', 'min:0'],
        ]);

        $finance = Finance::create([
            'user_id' => $request->user()->id,
            'chapitre' => $validated['chapitre'],
            'dotation' => $validated['dotation'] ?? 0,
            'engage' => $validated['engage'] ?? 0,
            'paye' => $validated['paye'] ?? 0,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Finance created.',
            'data' => [
                'finance' => $finance,
            ],
        ], 201);
    }

    public function show(Request $request, Finance $finance): JsonResponse
    {
        if ($finance->user_id !== $request->user()->id) abort(403);

        return response()->json([
            'success' => true,
            'data' => [
                'finance' => $finance,
            ],
        ]);
    }

    public function update(Request $request, Finance $finance): JsonResponse
    {
        if ($finance->user_id !== $request->user()->id) abort(403);

        $validated = $request->validate([
            'chapitre' => ['sometimes', 'string', 'max:255'],
            'dotation' => ['sometimes', 'numeric', 'min:0'],
            'engage' => ['sometimes', 'numeric', 'min:0'],
            'paye' => ['sometimes', 'numeric', 'min:0'],
        ]);

        $finance->fill($validated);
        $finance->save();

        return response()->json([
            'success' => true,
            'message' => 'Finance updated.',
            'data' => [
                'finance' => $finance,
            ],
        ]);
    }

    public function destroy(Request $request, Finance $finance): JsonResponse
    {
        if ($finance->user_id !== $request->user()->id) abort(403);

        $finance->delete();

        return response()->json([
            'success' => true,
            'message' => 'Finance deleted.',
        ]);
    }
}

