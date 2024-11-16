<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CocheController;
use App\Http\Controllers\CompraCocheController;
use App\Http\Controllers\tiendaCoche;
use App\Http\Controllers\AuthEmpresa;
use App\Http\Controllers\ReservaCoche;
use App\Http\Controllers\AuthCoche;
use App\Http\Controllers\PropietarioController;
use App\Http\Controllers\BuzonController;



Route::get('coches/{id_instalacion}/{matricula?}', [CocheController::class, 'obtenerCoches']);
Route::get('tiendaCoches/{id_empresa}', [tiendaCoche::class, 'extraerDatosCoches']);
Route::get('usuariosEmpresa/{id_empresa}/', [CompraCocheController::class, 'usuariosPorEmpresa']);
Route::get('instalaciones/{id_empresa}', [AuthController::class,'obtenerInstalacionesPorEmpresa']);
Route::get('refresh', [AuthController::class, 'refrescarToken'])->middleware('auth:api');
Route::get('esAdmin', [AuthController::class, 'esAdmin'])->middleware('auth:api');
Route::get('getUserData', [AuthController::class, 'getUserData']);
Route::get('usuarios', [AuthController::class, 'getUsers']);
Route::get('estadoCoches/{id_empresa}',[AuthCoche::class,'estadoCoche']);
Route::get('estados', [AuthCoche::class,'estadoTodosLosCoches']);
Route::get('registroCompraVenta/{id_empresa}/{matricula?}', [AuthCoche::class, 'registroCompraVenta']);
Route::get('propietarios/{id_empresa}/{nombre?}', [PropietarioController::class, 'obtenerPropietarios']);
Route::get('nombreEmpresas',[AuthEmpresa::class,'mostrarEmpresas']);
Route::get('tiendaOnline' ,[TiendaCoche::class,'extraerCoches']);
Route::get('cocheEmpresa/{matricula}', [TiendaCoche::class, 'obtenerEmpresaCoche']);
Route::get('mail/{id_empresa}', [BuzonController::class, 'obtenerMensajes']);

Route::Post('documentacionPropietario/{dni}', [PropietarioController::class, 'obtenerPropietarioPorDni']);
Route::Post('coche/documentacion/{matricula}', [AuthCoche::class, 'obtenerDocumentacionPorMatricula']);
Route::post('login', [AuthController::class, 'login']);
Route::post('registrar', [AuthController::class, 'registro']);
Route::post('registroAdmin',[AuthController::class, 'registroPorAdmin']);
Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:api');
Route::post('compraCoche',[CompraCocheController::class, 'registroCompra']);
Route::post('registroEmpresa',[AuthEmpresa::class, 'registrarEmpresa']);
Route::post('registroVenta', [ReservaCoche::class, 'reserva']);
Route::post('actualizarCoche', [AuthCoche::class, 'actualizarEstado']);
Route::post('eliminarEmpresa/{id_empresa}', [AuthEmpresa::class, 'eliminarEmpresa']);
Route::post('contactar', [TiendaCoche::class, 'recogerMensaje']);
Route::post('eliminarMensaje', [BuzonController::class, 'eliminarMensaje']);
