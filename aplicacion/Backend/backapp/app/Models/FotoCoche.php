<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FotoCoche extends Model
{
    // Nombre de la tabla en la base de datos
    protected $table = 'fotos_coche';

    // La clave primaria de la tabla
    protected $primaryKey = 'id_foto';

    // Atributos que se pueden asignar en masa
    protected $fillable = [
        'matricula',
        'foto',
    ];

    public $timestamps = false;


    // Relación con el modelo Coche (si es necesario)
    public function coche()
    {
        return $this->belongsTo(Coche::class, 'matricula', 'matricula');
    }
}

