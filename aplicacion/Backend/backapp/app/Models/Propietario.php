<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Propietario extends Model
{
    protected $table = 'propietario';
    protected $primaryKey = 'id_propietario';
    public $timestamps = false;
    protected $fillable = [
        'id_propietario',
        'DNI',
        'nombre',
        'apellido',
        'email',
        'telefono',
        'matricula',
        'id_documentacion',

    ];

    public function coche()
    {
        return $this->belongsTo(Coche::class, 'matricula', 'matricula');
    }
    public function documentacion()
    {
        return $this->belongsTo(DocumentacionPropietario::class, 'id_documentacion', 'id_documentacion');
    }
}
