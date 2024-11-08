<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Propietario;
use App\Models\DocumentacionCoche;
use App\Models\Coche;
use App\Models\FotoCoche;
use App\Models\Compra;
use App\Models\CompraVenta;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use App\Models\Usuario;
use Exception;
/**Esta clase gestiona las operaciones de compra de coches, incluyendo la validación de datos,
 * el registro de coches y documentación, y el almacenamiento de fotos y detalles de transacciones de compra.
*/

class CompraCocheController extends Controller
{
    public function usuariosPorEmpresa($id_empresa)
    {
        try{
            // Obtener usuarios que están relacionados con la empresa dada
            $usuarios = Usuario::whereHas('daAlta.instalaciones.empresa', function ($query) use ($id_empresa) {
                $query->where('id_empresa', $id_empresa);
            })->with(['daAlta.instalaciones.empresa'])->get();
            if($usuarios){
                return response()->json($usuarios);
            }

        }catch(Exception $e){
            return response()->json(['error' => 'Operación fallida fallida'], 400);
        }


        return response()->json($usuarios);
    }


    public function registroCompra(Request $request)
    {
        // Validar los datos de la solicitud
        try {
            Log::debug("Validando datos de la compra.");
            $request->validate([
                'nombre' => 'required|string',
                'apellido' => 'required|string',
                'email' => 'required|email',
                'telefono' => 'required|string',
                'dni' => 'required|string',
                'permisoCirculacion' => 'required|string',
                'fichaTecnica' => 'required|string',
                'fichaVerde' => 'required|string',
                'id_usuario' => 'required|int',
                'id_instalacion' => 'required|int',
                'matricula' => 'required|string',
                'marca' => 'required|string',
                'modelo' => 'required|string',
                'tipo_combustible' => 'required|string',
                'tipo_cambio' => 'required|string',
                'kilometraje' => 'required|integer',
                'año_matriculacion' => 'required|date',
                'fotos' => 'required|array|min:6',
                'fotos.*' => 'string',
                'comprador' => 'required|string'
            ]);
            Log::debug('Validación exitosa.');
        } catch (\Exception $e) {
            Log::error('Validación fallida.', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Validación fallida'], 400);
        }

        try {
            // Comenzamos una transacción
            DB::beginTransaction();
            Log::debug("Transacción iniciada.");
            $cocheConcatenado = $request->marca . ' ' . $request->modelo;

            // Procesar la documentación
            $documentacionData = [];
            foreach (['permisoCirculacion', 'fichaTecnica', 'fichaVerde'] as $doc) {
                $docBase64 = $request->input($doc);
                if ($docBase64) {
                    Log::debug("Procesando documentación: $doc");

                    // Extraer la parte base64 del string (si incluye el encabezado de datos)
                    $docBase64 = preg_replace('/^data:image\/\w+;base64,/', '', $docBase64);
                    $docBase64 = str_replace(' ', '+', $docBase64);

                    // Decodificar la imagen
                    $docData = base64_decode($docBase64);

                    // Generar un nombre único para la imagen
                    $nombreArchivo = time() . '_' . $doc;

                    // Guardar la imagen en el almacenamiento público
                    Storage::disk('public')->put($nombreArchivo, $docData);

                    // Guardar la ruta de la imagen
                    $documentacionData[$doc] = 'storage/' . $nombreArchivo;
                    Log::debug("Documentación guardada: " . $documentacionData[$doc]);
                } else {
                    Log::warning("No se recibió documentación para: $doc");
                }
            }

            // Guardar la documentación del coche
            $documentacionCoche = DocumentacionCoche::create([
                'permiso_circulacion' => $documentacionData['permisoCirculacion'] ?? null,
                'ficha_tecnica' => $documentacionData['fichaTecnica'] ?? null,
                'ficha_verde' => $documentacionData['fichaVerde'] ?? null,
                'fecha_documentacion' => now()
            ]);


            $documentacionId = $documentacionCoche->id_documentacion;

            $matricula = $request->matricula;
            Log::debug("Creando coche con datos: ", [
                'matricula' => $matricula,
            ]);

            // Guardar el coche
            $coche = Coche::create([
                'matricula' =>$matricula,
                'marca' => $request->marca,
                'modelo' => $request->modelo,
                'tipo_combustible' => $request->tipo_combustible,
                'tipo_cambio' => $request->tipo_cambio,
                'kilometraje' => $request->kilometraje,
                'año_matriculacion' => $request->año_matriculacion,
                'id_documentacionCoche' => $documentacionId,
                'id_instalacion' => $request->id_instalacion
            ]);
            log::debug("coche creado con: " ,[
                'id_documentacion: ' , $documentacionId,
                'matricula: ', $coche->matricula,
                'kilometraje: ', $coche->kilometraje
            ]);
            // Verificar que el coche ha sido creado antes de insertar fotos
            if (!$coche) {
                Log::error("No se pudo crear el coche.");
                return response()->json(['error' => 'No se pudo crear el coche.'], 500);
            }

            // Crear el propietario
            $propietario = Propietario::create([
                'nombre' => $request->nombre,
                'apellido' => $request->apellido,
                'email' => $request->email,
                'telefono' => $request->telefono,
                'matricula' => $coche->matricula,
                'DNI' => $request->dni
            ]);

            Log::debug("Propietario creado con ID: " . $propietario->id_propietario);



            $compraVenta = CompraVenta::create([
                'fecha' => now(),
                'comprador' => $request->comprador,
                'vendedor' => $request->nombre,
                'coche' => $cocheConcatenado,
                'accion_realizada' => 'Compra',
                'id_propietario' => $propietario->id_propietario,
                'id_documentacionCoche' => $documentacionId,
                'matricula' => $coche->matricula
            ]);

            Log::debug("Compra-venta registrada con ID: " . $compraVenta->id_compraVenta);

            // Procesar las fotos del coche
            $fotosBase64 = $request->input('fotos', []);
            if (is_array($fotosBase64)) {
                foreach ($fotosBase64 as $index => $fotoBase64) {
                    Log::debug("Procesando foto $index.");

                    // Extraer el formato de la imagen (e.g., png, jpeg)
                    if (preg_match('/^data:image\/(\w+);base64,/', $fotoBase64, $type)) {
                        $extension = strtolower($type[1]); // jpg, png, gif, etc.

                        // Verificar si la extensión es válida
                        if (!in_array($extension, ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
                            Log::error("Formato de imagen no soportado para foto $index.");
                            return response()->json(['error' => 'Formato de imagen no soportado.'], 400);
                        }

                        // Eliminar la cabecera base64 para obtener solo los datos
                        $fotoBase64 = preg_replace('/^data:image\/\w+;base64,/', '', $fotoBase64);
                        $fotoBase64 = str_replace(' ', '+', $fotoBase64);

                        // Decodificar la imagen
                        $fotoData = base64_decode($fotoBase64);

                        // Generar un nombre único para la imagen
                        $nombreArchivo = 'foto_' . time() . '_' . $index . '.' . $extension;

                        Storage::disk('public')->put($nombreArchivo, $fotoData);
                        Log::debug("Foto guardada: storage/$nombreArchivo");

                        // Guardar la ruta de la imagen en la base de datos
                        FotoCoche::create([
                            'matricula' => $request->matricula,
                            'foto' => 'storage/' . $nombreArchivo, // Guardar la ruta completa
                        ]);
                    } else {
                        Log::error("No se pudo determinar el formato de la imagen para foto $index.");
                        return response()->json(['error' => 'Formato de imagen no soportado.'], 400);
                    }
                }
            }
            $compra = Compra::create([
                'id_usuario' => $request->id_usuario,
                'matricula' => $coche->matricula
            ]);

            // Confirmar la transacción
            DB::commit();
            Log::info("Transacción completada exitosamente.");
            return response()->json(['success' => 'Compra registrada exitosamente.'], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Error durante el registro de la compra: " . $e->getMessage());
            return response()->json(['error' => 'Error al registrar la compra.'], 500);
        }
    }


}
