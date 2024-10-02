<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Coche extends Model
{
    // Nombre de la tabla en la base de datos
    protected $table = 'coche';

    // Clave primaria


    // Indica que la clave primaria es una cadena y no un entero
    protected $casts = [
        'matricula' => 'string',
        'año_matriculacion' => 'date',
    ];

    // Si tu tabla no usa timestamps, puedes desactivar los timestamps
    public $timestamps = false;

    // Campos que pueden ser llenados masivamente
    protected $fillable = [
        'matricula',
        'marca',
        'modelo',
        'tipo_combustible',
        'tipo_cambio',
        'kilometraje',
        'año_matriculacion',
        'id_documentacionCoche',
        'id_compraVenta',
        'id_instalacion',
        'estado'
    ];

    // Relación con el modelo DocumentacionCoche
    public function documentacion()
    {
        return $this->belongsTo(DocumentacionCoche::class, 'id_documentacionCoche', 'id_documentacion');
    }

    // Relación con el modelo CompraVenta
    public function compraVenta()
    {
        return $this->belongsTo(CompraVenta::class, 'matricula', 'matricula');
    }

    // Relación con el modelo Propietario
    public function propietario()
    {
        return $this->hasOne(Propietario::class, 'matricula', 'matricula');
    }

    // Relación con las fotos del coche
    public function fotos()
    {
        return $this->hasMany(FotoCoche::class, 'matricula', 'matricula');
    }

    // Relación con la tabla Compra
    public function compras()
    {
        return $this->hasMany(Compra::class, 'matricula', 'matricula');
    }

    // Relación con la tabla Venta
    public function ventas()
    {
        return $this->hasMany(Venta::class, 'matricula', 'matricula');
    }
    public function instalaciones(){
        return $this->belongsTo(Instalaciones::class. 'id_instalacion', 'id_instalacion');
    }
}
