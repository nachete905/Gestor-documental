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

    // Si la clave primaria no es un entero autoincremental, descomenta la siguiente línea
    // public $incrementing = false;

    // La fecha de creación y actualización se maneja automáticamente
    public $timestamps = false;

    // Los tipos de datos de los atributos de fecha
    protected $casts = [
       // 'foto' => 'binary',
    ];

    // Relación con el modelo Coche (si es necesario)
    public function coche()
    {
        return $this->belongsTo(Coche::class, 'matricula', 'matricula');
    }
}

