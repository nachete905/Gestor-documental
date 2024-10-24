<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompraVenta extends Model
{
    // Nombre de la tabla asociada al modelo
    protected $table = 'compra_venta';

    // Si deseas que las fechas se manejen automáticamente, puedes incluirlas aquí
    public $timestamps = false;

    // Definir los campos que se pueden asignar masivamente
    protected $fillable = [
        'id_compraVenta',
        'fecha',
        'comprador',
        'vendedor',
        'coche',
        'accion_realizada',
        'id_propietario',
        'id_documentacionCoche',
        'matricula'
    ];

    // Relación con el modelo `DocumentacionPropietario`
    public function propietario()
    {
        return $this->belongsTo(Propietario::class, 'id_propietario', 'id_propietario');
    }

    // Relación con el modelo `DocumentacionCoche`
    public function documentacionCoche()
    {
        return $this->belongsTo(DocumentacionCoche::class, 'id_documentacionCoche', 'id_documentacion');
    }

    // Relación con el modelo `Coche`
    public function coche()
    {
        return $this->belongsTo(Coche::class, 'coche', 'matricula');
    }



}
