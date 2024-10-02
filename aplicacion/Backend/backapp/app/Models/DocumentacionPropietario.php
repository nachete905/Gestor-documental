<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DocumentacionPropietario extends Model
{
    protected $table = 'documentacion_propietario';
    protected $primaryKey = 'id_documentacion';

    protected $fillable = [
        'id_documentacion',
        'nominas',
        'carnet',
        'DNI',

    ];

    public $timestamps = false;
    public function propietario()
    {
        return $this->hasOne(Propietario::class, 'id_documentacion', 'id_documentacion');
    }

}
