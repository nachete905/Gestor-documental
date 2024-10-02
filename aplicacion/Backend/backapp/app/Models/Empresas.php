<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Empresas extends Model
{
    use HasFactory;

    protected $table = 'empresas';
    protected $primaryKey = 'id_empresa';

    public $timestamps = false;
    protected $fillable = [
        'nombreEmpresa',
        'instalaciones',
        'contacto',
        'CIF',
        'fecha_alta',
        'id_empresa'
    ];

    // Relación de uno a muchos con Instalaciones
    public function instalaciones()
    {
        return $this->hasMany(Instalaciones::class, 'id_empresa');
    }
}
