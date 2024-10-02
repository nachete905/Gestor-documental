<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CocheController;
use App\Http\Controllers\CompraCocheController;
use App\Http\Controllers\tiendaCoche;
use App\Http\Controllers\AuthEmpresa;
use App\Http\Controllers\ReservaCoche;

Route::get('coches/{id_instalacion}/{matricula?}', [CocheController::class, 'obtenerCoches']);
Route::get('tiendaCoches/{id_empresa}', [tiendaCoche::class, 'extraerDatosCoches']);
Route::get('usuariosEmpresa/{id_empresa}/', [CompraCocheController::class, 'usuariosPorEmpresa']);
Route::get('instalaciones/{id_empresa}', [AuthController::class,'obtenerInstalacionesPorEmpresa']);
Route::get('refresh', [AuthController::class, 'refrescarToken'])->middleware('auth:api');
Route::get('esAdmin', [AuthController::class, 'esAdmin'])->middleware('auth:api');
Route::get('getUserData', [AuthController::class, 'getUserData']);
Route::get('usuarios', [AuthController::class, 'getUsers']);

Route::post('login', [AuthController::class, 'login']);
Route::post('registrar', [AuthController::class, 'registro']);
Route::post('registroAdmin',[AuthController::class, 'registroPorAdmin']);
Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:api');
Route::post('compraCoche',[CompraCocheController::class, 'registroCompra']);
Route::post('registroEmpresa',[AuthEmpresa::class, 'registrarEmpresa']);
Route::post('registroVenta', [ReservaCoche::class, 'reserva']);
