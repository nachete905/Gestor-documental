<?php

namespace App\Http\Controllers;

use App\Models\Coche;
use App\Models\Instalaciones;
use Illuminate\Http\Request;
/**
 *
 * Esta clase maneja la obtención de coches relacionados con una empresa específica. Permite
 * buscar todos los coches asociados a las instalaciones de la empresa, así como filtrar por
 * una matrícula específica si se proporciona.
 */

class CocheController extends Controller
{
    public function obtenerCoches($id_empresa, $matricula = null)
    {
        // Primero obtenemos todas las instalaciones asociadas a la empresa
        $instalaciones = Instalaciones::where('id_empresa', $id_empresa)->pluck('id_instalacion');

        // Si hay una matrícula específica, filtramos por ella además de las instalaciones
        if ($matricula) {
            $coche = Coche::with(['documentacion', 'propietario'])
                ->whereIn('id_instalacion', $instalaciones)
                ->where('matricula', $matricula)
                ->first();
            return response()->json($coche);
        } else {
            // Si no hay matrícula, simplemente obtenemos todos los coches asociados a las instalaciones de la empresa
            $coches = Coche::with(['documentacion', 'propietario'])
                ->whereIn('id_instalacion', $instalaciones)
                ->get();
            return response()->json($coches);
        }
    }



}
