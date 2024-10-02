<?php

namespace App\Http\Controllers;


use App\Models\Coche;
use App\Models\Usuario;
use Illuminate\Support\Facades\Log;
class tiendaCoche extends Controller

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

}
