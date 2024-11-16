<?php

namespace App\Http\Controllers;


use App\Models\Coche;
use App\Models\Empresas;
use App\Models\Mensaje;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
/** Esta clase maneja la extracción de datos de coches para una empresa específica,
 * obteniendo los coches adquiridos por los usuarios de la empresa y cargando sus fotos asociadas.
*/

class TiendaCoche extends Controller

{   public function extraerDatosCoches($id_empresa)
    {
        // Obtener los usuarios que pertenecen a la empresa por medio de las instalaciones
        $usuarios = Usuario::whereHas('daAlta.instalaciones', function ($query) use ($id_empresa) {
            $query->where('id_empresa', $id_empresa);
        })->pluck('id_usuario');

        // Cargar los coches que fueron comprados por los usuarios de la empresa, junto con sus fotos
        $coches = Coche::with('fotos')
            ->whereIn('matricula', function ($query) use ($usuarios) {
                $query->select('matricula')
                      ->from('compra')
                      ->whereIn('id_usuario', $usuarios);
            })
            ->get();

        // Log de los datos extraídos
        Log::debug('Coches y fotos extraídas para la empresa', ['empresa_id' => $id_empresa, 'coches' => $coches]);

        return response()->json($coches);
    }
    public function extraerCoches(){
        try {
            $coches = Coche::with('fotos')->get();
            return response()->json($coches);

        }catch (\Exception $e){
            return response()->json(['error' => 'Error al mostrar los coches'], 400);
        }
    }
    public function obtenerEmpresaCoche($matricula)
    {
        try {
            // Buscar la empresa asociada a la matrícula del coche usando la relación con instalaciones
            $empresa = Empresas::whereHas('instalaciones.coches', function ($query) use ($matricula) {
                $query->where('matricula', $matricula);
            })->first();

            if ($empresa) {
                // Retornar la información de la empresa en formato JSON
                return response()->json($empresa, 200);
            } else {
                // Si no se encuentra la empresa, devolver un error
                return response()->json(['error' => 'Empresa no encontrada para la matrícula proporcionada'], 404);
            }
        } catch (\Exception $e) {
            Log::error('Error al obtener la empresa del coche.', ['matricula' => $matricula, 'error' => $e->getMessage()]);

            return response()->json(['error' => 'Error al obtener la empresa del coche'], 500);
        }
    }

    public function recogerMensaje(Request $request)
    {
        try {
            // Validamos que el JSON contenga los campos necesarios
            $request->validate([
                'id_empresa' =>'required|int',
                'mensaje' => 'required|array', // 'mensaje' es un array de objetos
                'mensaje.*.nombre' => 'required|string|max:50',
                'mensaje.*.email' => 'required|email',
                'mensaje.*.mensaje' => 'required|string|max:3000',
            ]);

            // Procesamos el JSON recibido
            $mensajeData = $request->input('mensaje'); // Esto obtiene el array de objetos
            $id_empresa = $request->id_empresa;
            DB::beginTransaction();

            // Iteramos sobre cada objeto y almacenamos el JSON completo en el campo 'mensaje'
            foreach ($mensajeData as $data) {
                Mensaje::create([
                    'id_empresa' => $id_empresa,
                    'mensaje' => json_encode($data), // Convertimos el array/objeto a JSON y lo guardamos en el campo mensaje
                ]);
            }

            DB::commit();

            return response()->json([
                'message' => 'Mensaje(s) guardado(s) correctamente.',
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al registrar el mensaje.', ['error' => $e->getMessage()]);

            return response()->json([
                'message' => 'Error al registrar el mensaje',
                'error' => $e->getMessage()
            ], 500);
        }
    }


}
