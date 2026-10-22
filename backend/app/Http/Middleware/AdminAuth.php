<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->session()->has('admin_logged_in') || !$request->session()->get('admin_logged_in')) {
            return redirect()->route('admin.login')->with('error', 'Please log in to access the admin panel.');
        }

        // Re-check on every request so deleted or demoted accounts lose access immediately
        $user = User::find($request->session()->get('admin_user_id'));
        if (!$user || !$user->hasRole('super-admin')) {
            $request->session()->invalidate();
            return redirect()->route('admin.login')->with('error', 'Please log in to access the admin panel.');
        }

        return $next($request);
    }
}
