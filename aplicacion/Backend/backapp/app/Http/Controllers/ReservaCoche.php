<?php

namespace App\Http\Controllers;

use App\Models\DocumentacionPropietario;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\Coche;

use App\Models\Propietario;
use App\Models\Usuario;


use Exception;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;

class ReservaCoche extends Controller
{

    public function reserva(Request $request)
    {
        try {
            // Validar los datos recibidos
            $request->validate([
                'nombre' => 'required|string|max:255',
                'apellido' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'telefono' => 'required|string|max:20',
                'vendedor' => 'required|integer',  // ID del vendedor
                'coche' => 'required|string',  // Modelo del coche
                'matricula' => 'required|string',  // Matrícula del coche
                'id_usuario' => 'required|int',
                'documentacion' => 'required|array',
                'documentacion.nominas' => 'required|string',
                'documentacion.carnet' => 'required|string',
                'documentacion.DNI' => 'required|string|max:20',
            ]);
        } catch (Exception $e) {
            return response()->json(['error' => 'Falla en la validación: ' . $e->getMessage()], 400);
        }

        try {
            DB::beginTransaction();
            Log::info('Procesando datos de la venta');

            // Procesar y guardar documentación del propietario
            $fotosBase64 = $request->input('documentacion', []);

            // Verifica que las fotos se hayan recibido
            if (!is_array($fotosBase64) || count($fotosBase64) < 3) {
                return response()->json(['error' => 'No se recibieron fotos válidas.'], 400);
            }

            // Guardar cada foto
            $documentacionData = [];
            $index = 0; // Para el nombre de las imágenes

            // Procesar solo las fotos de "nominas" y "carnet"
            foreach (['nominas', 'carnet'] as $campo) {
                $fotoBase64 = $fotosBase64[$campo] ?? null;

                if ($fotoBase64 && preg_match('/^data:image\/(\w+);base64,/', $fotoBase64, $type)) {
                    $extension = strtolower($type[1]);

                    if (!in_array($extension, ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
                        return response()->json(['error' => 'Formato de imagen no soportado.'], 400);
                    }

                    // Decodificar y guardar la imagen
                    $fotoBase64 = preg_replace('/^data:image\/\w+;base64,/', '', $fotoBase64);
                    $fotoBase64 = str_replace(' ', '+', $fotoBase64);
                    $fotoData = base64_decode($fotoBase64);

                    if ($fotoData === false) {
                        return response()->json(['error' => 'La imagen no pudo ser decodificada.'], 400);
                    }

                    $nombreArchivo = 'documentacion/' . $request->documentacion['DNI'] . '/foto_' . $campo . '_' . time() . '.' . $extension;
                    Storage::disk('public')->put($nombreArchivo, $fotoData);

                    // Almacenar la ruta de la imagen solo para nominas y carnet
                    $documentacionData[$campo] = 'storage/' . $nombreArchivo;
                } else {
                    return response()->json(['error' => 'No se pudo determinar el formato de la imagen de ' . $campo], 400);
                }
            }

          $documentacionPropietario = DocumentacionPropietario::create([
                'nominas' => $documentacionData['nominas'] ?? null,
                'carnet' => $documentacionData['carnet'] ?? null,
                'DNI' => $request->documentacion['DNI']
            ]);



            // Actualizar el estado del coche en la base de datos
            DB::table('coche')->where('matricula', $request->matricula)->update(['estado' => 'vendido']);

            // Obtener el propietario anterior
            $propietarioAnterior = Propietario::where('matricula', $request->matricula)->first();

            // Actualizar el propietario existente
            $propietarioAnterior->update([
                'nombre' => $request->nombre,
                'apellido' => $request->apellido,
                'email' => $request->email,
                'telefono' => $request->telefono,
                'matricula' => $request->matricula,
                'id_documentacion' => $documentacionPropietario->id_documentacion // Asignar nueva documentación
            ]);

            // Obtener el id la documentación del coche existente
            $matricula = $request->matricula;

            $idDocumentacionCoche = Coche::where('matricula', $matricula)
                ->with('documentacion')
                ->first()
                ?->documentacion
                ?->id_documentacion;
            // Registrar la venta en la tabla `compra_venta`
            DB::table('compra_venta')->insert([
                'fecha' => now(),
                'comprador' => $request->nombre . ' ' . $request->apellido,
                'vendedor' => Usuario::find($request->vendedor)->nombre,
                'coche' => $request->coche,
                'accion_realizada' =>'Venta',
                'id_propietario' => $propietarioAnterior->id_propietario, // Asignar ID del propietario
                'id_documentacionCoche' => $idDocumentacionCoche,
                'matricula' => $request->matricula,
            ]);

            // Registrar la venta en la tabla 'venta'
            DB::table('venta')->insert([
                'id_usuario' => $request->vendedor,
                'matricula' => $request->matricula
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Venta registrada con éxito. Nuevo propietario actualizado y registro en compra_venta.',
                'nuevo_propietario' => $propietarioAnterior,
                'compra_venta' => true
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al registrar la venta.', ['error' => $e->getMessage()]);

            return response()->json([
                'message' => 'Error al registrar la venta',
                'error' => $e->getMessage()
            ], 500);
        }
    }

}
