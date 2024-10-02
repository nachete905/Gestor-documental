<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Instalaciones extends Model
{
    use HasFactory;

    protected $table = 'instalaciones';
    protected $primaryKey = 'id_instalacion';

    public $timestamps = false;
    protected $fillable = [
        'ubicacion',
        'telefono',
        'localidad',
        'principal',
        'id_empresa',
        'id_instalacion'
    ];

    // Relación inversa de muchos a uno con Empresa
    public function empresa()
    {
        return $this->belongsTo(Empresas::class, 'id_empresa');
    }

    // Relación de uno a muchos con DaAlta
    public function daAlta()
    {
        return $this->hasMany(DaAlta::class, 'id_instalacion');
    }
    public function coches(){
        return $this->hasMany(Coche::class, 'id_instalacion');
    }

}

