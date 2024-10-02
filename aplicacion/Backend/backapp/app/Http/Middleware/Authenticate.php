<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Facades\JWTAuth;

class Authenticate
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        try {
            // Intenta autenticar al usuario
            $user = JWTAuth::parseToken()->authenticate();

            // Si la autenticación falla, se lanzará una excepción
            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }
        } catch (\Exception $e) {
            // En caso de error (token inválido, expirado, etc.)
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return $next($request);
    }
}
