<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductionConfigTest extends TestCase
{
    use RefreshDatabase;

    private function preflight(string $origin)
    {
        return $this->call('OPTIONS', '/api/services', [], [], [], [
            'HTTP_ORIGIN' => $origin,
            'HTTP_ACCESS_CONTROL_REQUEST_METHOD' => 'GET',
        ]);
    }

    public function test_cors_only_allows_configured_origins(): void
    {
        config(['cors.allowed_origins' => ['https://ycdc.in', 'https://www.ycdc.in']]);

        $this->preflight('https://ycdc.in')
            ->assertHeader('Access-Control-Allow-Origin', 'https://ycdc.in');
        $this->preflight('https://www.ycdc.in')
            ->assertHeader('Access-Control-Allow-Origin', 'https://www.ycdc.in');

        // Another website never gets its own origin echoed back, so browsers block it
        $this->assertNotSame('https://evil.example', $this->preflight('https://evil.example')->headers->get('Access-Control-Allow-Origin'));
    }

    public function test_cors_origins_are_read_from_env_list(): void
    {
        $this->assertSame(['http://localhost:5173', 'http://localhost:4173'], config('cors.allowed_origins'));
    }

    public function test_admin_login_tokens_expire(): void
    {
        $this->assertSame(480, config('sanctum.expiration'));

        $this->seed(RolesAndPermissionsSeeder::class);
        $user = User::where('email', 'admin@ycdc.com')->first();
        $token = $user->createToken('auth_token')->plainTextToken;

        $this->withToken($token)->getJson('/api/me')->assertOk();

        $this->travel(481)->minutes();
        $this->app['auth']->forgetGuards();
        $this->withToken($token)->getJson('/api/me')->assertUnauthorized();
    }
}
