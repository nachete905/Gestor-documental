<?php

namespace App\Http\Controllers;
use App\Models\Coche;
use App\Models\DocumentacionCoche;
use App\Models\CompraVenta;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
/**
 *
 * Esta clase contiene métodos para gestionar operaciones relacionadas con coches en la empresa,
 * como obtener el estado de los coches asociados a una empresa, registrar las transacciones de
 * compra y venta, y obtener la documentación específica de un coche.
 */
class AuthCoche extends Controller
{
    public function estadoCoche($id_empresa)
    {
        // Obtener los coches de las instalaciones de la empresa especificada
        $estadosCoches = Coche::whereHas('instalaciones', function ($query) use ($id_empresa) {
            $query->where('id_empresa', $id_empresa);
        })->pluck('estado');

        // Devolver los estados en un formato adecuado
        return response()->json($estadosCoches);
    }
    public function estadoTodosLosCoches()
    {
        try {
            // Obtener el estado de todos los coches
            $estadosCoches = Coche::pluck('estado');
            // Devolver los estados en un formato adecuado
            return response()->json($estadosCoches);

        }catch (\Exception $e){
            return response()->json(['error' => 'Error al mostrar los estados'], 400);
        }


    }

    public function registroCompraVenta($id_empresa, $matricula = null)
    {
        // Crear una consulta base
        $query = CompraVenta::query()
            ->join('coche', 'compra_venta.matricula', '=', 'coche.matricula')
            ->join('instalaciones', 'coche.id_instalacion', '=', 'instalaciones.id_instalacion')
            ->select('compra_venta.*');

        // Filtrar por id_empresa
        $query->where('instalaciones.id_empresa', $id_empresa);

        // Filtrar por matricula, si se proporciona
        if ($matricula) {
            // Convertir ambos lados de la comparación a minúsculas y eliminar espacios en blanco
            $matricula = strtolower(trim($matricula)); // Convierte la matrícula a minúsculas y elimina espacios
            $query->whereRaw('LOWER(TRIM(coche.matricula)) = ?', [$matricula]); // Comparar matrícula insensible a mayúsculas/minúsculas y espacios
        }

        // Ejecutar la consulta y obtener los resultados
        $resultados = $query->get();

        // Devolver los resultados en formato JSON
        return response()->json($resultados);
    }
    public function obtenerDocumentacionPorMatricula($matricula)
    {
        // Buscar el coche por su matrícula
        $coche = Coche::where('matricula', $matricula)->first();


        $nombre = $coche->marca." ".$coche->modelo;
        if ($coche) {
            return [
                'documentacion' => $coche->documentacion,
                'año_matriculacion' => $coche->año_matriculacion,
                'coche' => $nombre
            ];
        }

        // Si no se encuentra el coche, devolver null o manejar el error como prefieras
        return null;
    }

    public function actualizarEstado(Request $request)
    {
        try {
            // Registrar los datos recibidos
            Log::info('Datos recibidos para actualizar estado de coches:', $request->all());

            // Validar los datos recibidos desde la petición
            $request->validate([
                'estados' => 'required|array',
                'estados.*.matricula' => 'required|string|exists:coche,matricula',
                'estados.*.estado' => 'required|string|in:disponible,en-reparacion',
            ]);


            DB::beginTransaction();
            // Recorrer cada coche y actualizar su estado
            foreach ($request->estados as $cocheData) {
                Log::info('Actualizando coche con matrícula: ' . $cocheData['matricula'] . ' al estado: ' . $cocheData['estado']);

                // Actualizamos el estado de cada coche según la matrícula
                DB::table('coche')
                    ->where('matricula', $cocheData['matricula'])
                    ->update(['estado' => $cocheData['estado']]);
            }

            // Commit de la transacción
            DB::commit();


            // Devolver una respuesta indicando que los estados se han actualizado correctamente
            return response()->json(['success' => true, 'message' => 'Estados de los coches actualizados correctamente.']);
        } catch (\Exception $e) {
            DB::rollBack();

            // Registrar el error
            Log::error('Error al actualizar el estado de los coches:', ['error' => $e->getMessage()]);

            return response()->json([
                'message' => 'Error al actualizar el estado',
                'error' => $e->getMessage()
            ], 500);
        }

    }

}
