<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Propietario;
use App\Models\Coche;
use App\Models\Instalaciones;

class PropietarioController extends Controller
{
    public function obtenerPropietarios($id_empresa, $dni = null)
    {
        // Consultamos los propietarios
        $query = Propietario::query()
            ->whereHas('coche', function ($query) use ($id_empresa) {
                $query->whereHas('instalaciones', function ($query) use ($id_empresa) {
                    $query->where('id_empresa', $id_empresa);
                });
            });


        if ($dni) {
            $query->where('DNI', 'LIKE', '%' . $dni . '%'); // Filtrar por DNI en la tabla propietario
        }


        $propietarios = $query->get();


        return response()->json($propietarios);
    }
    public function obtenerPropietarioPorDni($dni)
    {

        $propietario = Propietario::with('documentacion')
        ->where('DNI', $dni)
        ->first();

        if (!$propietario) {
            return response()->json(['error' => 'Propietario no encontrado'], 404);
        }

        return response()->json($propietario);
    }
}
