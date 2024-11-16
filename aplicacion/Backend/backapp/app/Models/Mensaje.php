<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mensaje extends Model
{
    use HasFactory;

    protected $table = 'mensajes';
    protected $primaryKey = 'id_mensaje';

    public $timestamps = false;
    protected $fillable = [
        'id_empresa',
        'mensaje'
    ];

    // Relación de muchos a uno con Empresas
    public function empresa()
    {
        return $this->belongsTo(Empresas::class, 'id_empresa', 'id_empresa');
    }
}
