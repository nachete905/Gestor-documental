<?php

namespace App\Http\Controllers;

use App\Models\Mensaje;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
class BuzonController extends Controller
{
    public function obtenerMensajes($id_empresa){
        try {
            $mensajes = Mensaje::where('id_empresa',$id_empresa)->get();
            return response()->json($mensajes);
        }catch (\Exception $e){
            return response()->json(["error"=>$e->getMessage()]);
        }
    }

    public function eliminarMensaje(Request $request) {
        // Depuración: Inicio del método
        Log::info('Inicio del método eliminarMensaje');

        try {
            // Validación del ID del mensaje
            $request->validate([
                'id' => 'required|integer',
            ]);
        } catch (\Exception $e) {
            Log::error('Error en la validación: ' . $e->getMessage());
            return response()->json(["error" => $e->getMessage()]);
        }

        try {
            $id_mensaje = $request->input('id');

            $mensaje = Mensaje::find($id_mensaje);

            if ($mensaje) {
                $mensaje->delete();
                return response()->json([
                    'message' => 'mensaje eliminado',
                ], 200);
            } else {
                return response()->json(["mensaje" => "El mensaje no existe"]);
            }
        } catch (\Exception $e) {
            return response()->json(["error al eliminar el mensaje" => $e->getMessage()]);
        }
    }

}
