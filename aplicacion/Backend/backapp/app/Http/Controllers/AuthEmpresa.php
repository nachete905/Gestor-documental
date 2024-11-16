<?php

namespace App\Http\Controllers;

use App\Models\Empresas;
use App\Models\Instalaciones;
use App\Models\Usuario;
use App\Models\DaAlta;
use App\Models\Coche;
use App\Models\Compra;
use App\Models\Venta;
use App\Models\FotoCoche;
use App\Models\DocumentacionCoche;
use App\Models\DocumentacionPropietario;
use App\Models\Propietario;
use App\Models\CompraVenta;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * Esta clase maneja la creación de una empresa junto con sus instalaciones y
 * el registro de un usuario asociado. Valida los datos de entrada y usa
 * transacciones para asegurar que la empresa, sus instalaciones y el usuario
 * se registren correctamente y de forma atómica.
 */
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

            return response()->json([
                'message' => 'Error al registrar la empresa',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function eliminarEmpresa($id_empresa)
    {
        // Iniciar transacción para asegurar la integridad de la eliminación
        DB::beginTransaction();

        try {
            // Primero obtenemos la empresa
            $empresa = Empresas::findOrFail($id_empresa);

            // Eliminar todas las instalaciones relacionadas con la empresa
            $instalaciones = Instalaciones::where('id_empresa', $id_empresa)->get();

            foreach ($instalaciones as $instalacion) {
                // Eliminar todos los coches relacionados con la instalación
                $coches = Coche::where('id_instalacion', $instalacion->id_instalacion)->get();

                foreach ($coches as $coche) {
                    // Eliminar fotos del coche
                    FotoCoche::where('matricula', $coche->matricula)->delete();

                    // Eliminar la documentacion del coche
                    DocumentacionCoche::where('id_documentacion', $coche->id_documentacionCoche)->delete();

                    // Eliminar la compra y venta asociada al coche
                    CompraVenta::where('matricula', $coche->matricula)->delete();

                    // Eliminar propietarios relacionados con el coche
                    Propietario::where('matricula', $coche->matricula)->delete();
                }

                // Eliminar todos los DaAlta relacionados con la instalación
                DaAlta::where('id_instalacion', $instalacion->id_instalacion)->delete();

                // Eliminar todos los coches relacionados con la instalación
                Coche::where('id_instalacion', $instalacion->id_instalacion)->delete();

                // Eliminar la instalación
                $instalacion->delete();
            }

            // Eliminar la empresa (relación de uno a muchos con Instalaciones, etc.)
            $empresa->delete();

            // Confirmar la transacción
            DB::commit();
            return response()->json(['message' => 'Empresa y todos los registros asociados han sido eliminados correctamente.']);
        } catch (\Exception $e) {
            // En caso de error, revertir la transacción
            DB::rollback();
            return response()->json(['message' => 'Error al eliminar la empresa: ' . $e->getMessage()], 500);
        }
    }

    public function mostrarEmpresas(){
        try {
            // Obtener el id y nombre de las empresas
            $empresas = Empresas::pluck('nombreEmpresa', 'id_empresa');

            // Mapear los resultados a la estructura deseada
            $empresasTransformadas = $empresas->map(function ($nombre, $id) {
                return [
                    'nombre' => $nombre,
                    'id' => $id
                ];
            });

            // Devolver la respuesta en formato JSON
            return response()->json($empresasTransformadas);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al mostrar las empresas'], 400);
        }
    }

}
