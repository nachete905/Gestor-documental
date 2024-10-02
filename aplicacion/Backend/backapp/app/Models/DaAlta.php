<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DaAlta extends Model
{
    use HasFactory;

    protected $table = 'da_alta';
    public $timestamps = false;
    protected $fillable = [
        'id_instalacion',
        'id_usuario',
        'fecha_alta'
    ];

    // Relación inversa de muchos a uno con Instalaciones
    public function instalaciones()
    {
        return $this->belongsTo(Instalaciones::class, 'id_instalacion');
    }

    // Relación inversa de muchos a uno con Usuario
    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'id_usuario');
    }
}
