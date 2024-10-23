<?php

namespace App\Http\Controllers;

use App\Models\Empresas;
use App\Models\Instalaciones;
use App\Models\Usuario;
use App\Models\DaAlta;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AuthEmpresa extends Controller
{
    // Método para registrar la empresa y sus instalaciones
    public function registrarEmpresa(Request $request)
    {
        try{
             // Validación de los datos que vienen en la request
            $request->validate([
                'nombreEmpresa' => 'required|string|max:255',
                'contacto' => 'required|string|max:255',
                'CIF' => 'required|string|max:20',
                'instalaciones' => 'required|array',
                'instalaciones.*.ubicacion' => 'required|string|max:255',
                'instalaciones.*.telefono' => 'required|string',
                'instalaciones.*.localidad' => 'required|string|max:255',
                'instalaciones.*.principal' => 'required|boolean',
                'nombre' => 'required|string',
                'apellido' => 'required|string',
                'email' => 'required|string|email',
                'telefono' => 'required|string',
                'password' => 'required|string|min:8',
                'tipoUser' => 'required|integer',
                'selectedInstalacion' => 'required|integer',
            ]);
        }catch(\Exception $e){
            return response()->json(['error' => 'Validación fallida'], 400);
        }



        // Comenzamos una transaccióncd
        DB::beginTransaction();

        try {

            // 1. Crear la empresa
            $empresa = Empresas::create([
                'nombreEmpresa' => $request->nombreEmpresa,
                'instalaciones' => count($request->instalaciones),
                'contacto' => $request->contacto,
                'CIF' => $request->CIF,
                'fecha_alta' => now()

            ]);

            // 2. Crear las instalaciones de la empresa
            foreach ($request->instalaciones as $instalacionData) {

                $instalacion = Instalaciones::create([
                    'ubicacion' => $instalacionData['ubicacion'],
                    'telefono' => $instalacionData['telefono'],
                    'localidad' => $instalacionData['localidad'],
                    'principal' => $instalacionData['principal'],
                    'id_empresa' => $empresa->id_empresa
                ]);
                $instalacionesIds[] = $instalacion->id_instalacion;

            }

            // 3. Crear el usuario
            $usuario = Usuario::create([
                'nombre' => $request->nombre,
                'apellido' => $request->apellido,
                'email' => $request->email,
                'telefono' => $request->telefono,
                'password' => $request->password,
                'tipoUser' => $request->tipoUser
            ]);

            $selectedInstalacionIndex = (int)$request->selectedInstalacion;
            if (isset($instalacionesIds[$selectedInstalacionIndex])) {
                $selectedInstalacionId = $instalacionesIds[$selectedInstalacionIndex];
                DaAlta::create([
                    'id_instalacion' => $selectedInstalacionId,
                    'id_usuario' => $usuario->id_usuario,
                    'fecha_alta' => now()
                ]);
            } else {
                return response()->json(['error' => 'Instalación seleccionada no válida.'], 400);
            }
            $token = JWTAuth::fromUser($usuario);
            DB::commit();

            return response()->json([
                'message' => 'Empresa registrada exitosamente',
                'empresa' => $empresa,
                'token' => $token
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al registrar la empresa.', ['error' => $e->getMessage()]);

            return response()->json([
                'message' => 'Error al registrar la empresa',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
