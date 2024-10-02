<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Compra extends Model
{
    use HasFactory;
    protected $table = 'compra';
    public $timestamps = false;
    protected $fillable = [
        'id_usuario',
        'matricula'
    ];

    public function usuario(){
        return $this->belongsTo(Usuario::class, 'id_usuario');
    }

    public function coche(){
        return $this->belongsTo(Coche::class, 'matricula');
    }

}
