<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\FinanceController;
use App\Http\Controllers\Api\MarcheController;
use App\Http\Controllers\Api\ScheduleController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function (): void {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
});

Route::middleware('auth:sanctum')->group(function (): void {
    Route::get('/me', [UserController::class, 'me']);

    Route::apiResource('finances', FinanceController::class);
    Route::apiResource('marches', MarcheController::class);

    Route::get('/schedule', [ScheduleController::class, 'index']);
});

