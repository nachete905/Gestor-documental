<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Usuario;
use App\Models\DaAlta;
use App\Models\Instalaciones;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Illuminate\Support\Facades\Auth;


use Exception;

class AuthController extends Controller
{
    public function obtenerInstalacionesPorEmpresa($id_empresa)
    {
        try {
            // Validar que $id_empresa es un número
            if (!is_numeric($id_empresa)) {
                return response()->json(['error' => 'ID de empresa no válido'], 400);
            }

            // Obtener las instalaciones de la empresa especificada
            $instalaciones = \App\Models\Instalaciones::where('id_empresa', $id_empresa)
                ->select('id_instalacion', 'ubicacion')
                ->get();

            // Retornar las instalaciones en formato JSON
            return response()->json([
                'success' => true,
                'data' => $instalaciones
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener instalaciones',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    /**
     * Cierra la sesión del usuario invalidando el token actual.
     */
    public function logout()
    {
        try {
            // Invalidar el token JWT actual
            JWTAuth::invalidate(JWTAuth::getToken());
            return response()->json(['message' => 'Sesión cerrada correctamente']);
        } catch (TokenExpiredException $e) {
            return response()->json(['error' => 'Token has expired'], 401);
        } catch (Exception $e) {
            return response()->json(['error' => 'An error occurred'], 500);
        }
    }

    /**
     * Registra un nuevo usuario y genera un token JWT.
     */
    public function registro(Request $request)
    {
        try {
            // Validar la solicitud
            $request->validate([
                'nombre' => 'required|string|max:50',
                'apellido' => 'required|string|max:50',
                'email' => 'required|string|email|max:50|unique:usuario',
                'telefono' => 'required|string|max:15',
                'password' => 'required|string|min:8',
            ]);

            // Crear un nuevo usuario
            $usuario = new Usuario;
            $usuario->nombre = $request->nombre;
            $usuario->apellido = $request->apellido;
            $usuario->email = $request->email;
            $usuario->telefono = $request->telefono;
            $usuario->password  = $request->password;

            // Establecer el tipo de usuario, valor predeterminado es 2
            $usuario->tipoUser = $request->filled('tipoUser') ? $request->tipoUser : 2;

            $usuario->save();
            // Generar el token JWT
            $token = JWTAuth::fromUser($usuario);

            return response()->json([
                'message' => 'Usuario registrado correctamente',
                'token' => $token,

            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => 'Validation error', 'message' => $e->getMessage()], 422);
        } catch (Exception $e) {
            return response()->json(['error' => 'An error occurred', 'message' => $e->getMessage()], 500);
            echo "estoy aqui";
        }
    }
    public function registroPorAdmin(Request $request)
    {
        try {
            $request->validate([
                'nombre' => 'required|string|max:50',
                'apellido' => 'required|string|max:50',
                'email' => 'required|string|email|max:50|unique:usuario',
                'telefono' => 'required|string|max:15',
                'password' => 'required|string|min:8',
                'tipoUser' => 'required|int',
                'id_instalacion' => 'required|int'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => 'Validation error', 'message' => $e->getMessage()], 422);
        } catch (Exception $e) {
            return response()->json(['error' => 'An error occurred', 'message' => $e->getMessage()], 500);
            
        }

        try {
            DB::beginTransaction();

            $usuario = Usuario::create([
                'nombre' => $request->nombre,
                'apellido' => $request->apellido,
                'email' => $request->email,
                'telefono' => $request->telefono,
                'password'  => $request->password,
                'tipoUser' => $request->tipoUser
            ]);

            $daAlta = DaAlta::create([
                'id_instalacion' => $request->id_instalacion,
                'id_usuario' => $usuario->id_usuario,
                'fecha_alta' => now()
            ]);
            $token = JWTAuth::fromUser($usuario);
            DB::commit();
            return response()->json([
                'message' => 'Usuario registrado correctamente',
                'usuario' => $usuario,
                'instalacion' => $daAlta,
                'token' => $token,

            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al registrar la empresa.', ['error' => $e->getMessage()]);

            return response()->json([
                'message' => 'Error al registrar la empresa',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Inicia sesión un usuario y retorna un token JWT.
     */ public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        try {
            // Encuentra el usuario por el email
            $user = Usuario::where('email', $credentials['email'])->first();

            // Verifica que el usuario existe y que la contraseña es correcta
            if ($user && Hash::check($credentials['password'], $user->password)) {
                // Genera el token manualmente
                $token = JWTAuth::fromUser($user);

                return response()->json([
                    'success' => true,
                    'message' => 'Login correcto',
                    'token' => $token,

                ], 200);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Credenciales inválidas'
                ], 401);
            }
        } catch (JWTException $e) {
            return response()->json([
                'success' => false,
                'message' => 'No se pudo crear el token'
            ], 500);
        }
    }



    /**
     * Obtiene los datos del usuario autenticado.
     */
    public function getUserData(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            // Obtener el id_empresa a través de las relaciones
            $empresaId = $user->daAlta()->with('instalaciones.empresa')->first()
                ?->instalaciones?->empresa->id_empresa; // Obtener el id_empresa
            $instalacionID = $user->daAlta()->first()?->id_instalacion;

            return response()->json([
                'success' => true,
                'user' => [
                    'id_usuario' => $user->id_usuario,
                    'nombre' => $user->nombre,
                    'apellido' => $user->apellido,
                    'id_instalacion' => $instalacionID,
                    'id_empresa' => $empresaId,

                ]
            ]);
        } catch (TokenExpiredException $e) {
            return response()->json(['error' => 'Token has expired'], 401);
        } catch (Exception $e) {
            return response()->json(['error' => 'An error occurred'], 500);
        }
    }

 /**
     * Refresca el token JWT actual.
     */
    public function refrescarToken()
    {
        try {
            $token = JWTAuth::refresh(JWTAuth::getToken());
            return response()->json([
                'success' => true,
                'token' => $token
            ]);
        } catch (TokenExpiredException $e) {
            return response()->json(['error' => 'Token has expired'], 401);
        } catch (Exception $e) {
            return response()->json(['error' => 'An error occurred'], 500);
        }
    }

    public function esAdmin()
    {
        try {
            $user = Auth::guard('api')->user();

            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            if (!($user instanceof \App\Models\Usuario)) {
                return response()->json(['error' => 'Invalid user type'], 400);
            }

            return response()->json([
                'isAdmin' => $user->esAdmin(),
                'isSuperRoot' => $user->esSuperRoot()
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Server Error', 'message' => $e->getMessage()], 500);
        }
    }
}
