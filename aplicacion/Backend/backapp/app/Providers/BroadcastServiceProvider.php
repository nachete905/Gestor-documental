<?php

namespace App\Providers;

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\ServiceProvider;

class BroadcastServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Broadcast::routes();

        /*
         * Aquí puedes registrar tus canales de transmisión si tienes alguno.
         * Por ejemplo, podrías tener un archivo separado donde defines tus canales:
         * require base_path('routes/channels.php');
         */
    }
}
