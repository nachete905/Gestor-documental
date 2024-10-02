<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DocumentacionCoche extends Model
{
    protected $table = 'documentacion_coche';
    protected $primaryKey = 'id_documentacion';
    protected $fillable = [
        'id_documentacion',
        'permiso_circulacion',
        'ficha_tecnica',
        'ficha_verde',
        'fecha_documentacion',

    ];

    public $timestamps = false;

    // Relación inversa con el modelo `CompraVenta`
    public function compraVenta()
    {
        return $this->hasOne(CompraVenta::class, 'id_documentacionCoche', 'id_documentacion');
    }
    public function coche()
    {
        return $this->hasMany(Coche::class, 'id_documentacionCoche', 'id_documentacion');
    }

}
