<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class Usuario extends Authenticatable implements JWTSubject
{

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }
    use HasFactory;

    protected $table = 'usuario';

    protected $primaryKey = 'id_usuario';

    public $timestamps = false;


    protected $fillable = [
        'nombre',
        'apellido',
        'email',
        'telefono',
        'password',
        'tipoUser',
        'id_usuario'

    ];

    protected $hidden = [
        'password',
    ];

    public function setPasswordAttribute($value)
    {
        $this->attributes['password'] = bcrypt($value);
    }
    public function esAdmin()
    {
        return $this->tipoUser === 1;
    }
    public function esSuperRoot()
    {
        return $this->tipoUser === 3;
    }
    public function esNormal(){
        return $this->tipoUser === 4;
    }
    public function daAlta()
    {
        return $this->hasMany(DaAlta::class, 'id_usuario');
    }
    public function compra(){
        return $this->hasMany(Compra::class, 'id_usuario');
    }



}
