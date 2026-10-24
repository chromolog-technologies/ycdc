<?php

namespace Tests\Feature;

// use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    /**
     * A basic test example.
     */
    public function test_root_redirects_to_admin_login(): void
    {
        $response = $this->get('/');

        // The root URL sends visitors to the admin login
        $response->assertRedirect('/admin/login');
    }
}
