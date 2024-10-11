<?php

namespace App\Http\Controllers;
use App\Models\Coche;
use App\Models\DocumentacionCoche;
use App\Models\CompraVenta;

use Illuminate\Http\Request;

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

    public function registroCompraVenta($id_empresa, $matricula = null)
    {
        // Crear una consulta base
        $query = CompraVenta::query()
            ->join('coche', 'compra_venta.matricula', '=', 'coche.matricula') // Unir con la tabla coche
            ->join('instalaciones', 'coche.id_instalacion', '=', 'instalaciones.id_instalacion') // Unir con la tabla instalaciones
            ->select('compra_venta.*'); // Selecciona todos los campos de compra_venta

        // Filtrar por id_empresa
        $query->where('instalaciones.id_empresa', $id_empresa);

        // Filtrar por matricula, si se proporciona
        if ($matricula) {
            $query->where('coche.matricula', $matricula); // Asegúrate de que el campo sea correcto
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


}
