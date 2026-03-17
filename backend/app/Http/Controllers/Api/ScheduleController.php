<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Schedule;
use Carbon\CarbonImmutable;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ScheduleController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'from' => ['sometimes', 'date'],
            'to' => ['sometimes', 'date'],
            'limit' => ['sometimes', 'integer', 'min:1', 'max:200'],
        ]);

        $from = isset($validated['from'])
            ? CarbonImmutable::parse($validated['from'])->startOfDay()
            : CarbonImmutable::today();

        $to = isset($validated['to'])
            ? CarbonImmutable::parse($validated['to'])->endOfDay()
            : $from->addMonths(2)->endOfDay();

        $limit = $validated['limit'] ?? 50;

        $events = Schedule::query()
            ->where('user_id', $request->user()->id)
            ->whereBetween('due_date', [$from->toDateString(), $to->toDateString()])
            ->orderBy('due_date')
            ->limit($limit)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'from' => $from->toDateString(),
                'to' => $to->toDateString(),
                'events' => $events,
            ],
        ]);
    }
}

