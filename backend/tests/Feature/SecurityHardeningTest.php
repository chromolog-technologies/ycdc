<?php

namespace Tests\Feature;

use App\Models\Lead;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SecurityHardeningTest extends TestCase
{
    use RefreshDatabase;

    // 1x1 transparent PNG
    private const PNG = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolesAndPermissionsSeeder::class);
    }

    private function leadPayload(array $extra = []): array
    {
        return array_merge([
            'patient_name' => 'Test Patient',
            'patient_phone' => '9999999999',
            'branch' => 'Pattom, Trivandrum',
            'type' => 'Online Consultation',
        ], $extra);
    }

    public function test_public_lead_rejects_php_upload(): void
    {
        Storage::fake('local');
        $shell = UploadedFile::fake()->createWithContent('shell.php', '<?php system($_GET["c"]);');

        $this->postJson('/api/leads', $this->leadPayload(['photo_attached' => $shell]))
            ->assertStatus(422);

        $this->assertDatabaseCount('leads', 0);
        $this->assertDirectoryDoesNotExist(public_path('uploads/leads'));
    }

    public function test_lead_photo_is_private_and_served_only_with_signature(): void
    {
        Storage::fake('local');
        $photo = UploadedFile::fake()->createWithContent('face.png', base64_decode(self::PNG));

        $this->postJson('/api/leads', $this->leadPayload(['photo_attached' => $photo]))
            ->assertCreated();

        $stored = Lead::first()->getRawOriginal('photo_attached');
        $this->assertStringEndsWith('.png', $stored);
        Storage::disk('local')->assertExists(Lead::PHOTO_DIR . '/' . $stored);

        // Unsigned direct link is refused
        $this->get('/uploads/leads/' . $stored)->assertForbidden();

        // The admin API hands out a signed link that the portal appends to /uploads/leads/
        Sanctum::actingAs(User::where('email', 'trivandrum.rec@ycdc.com')->first());
        $signed = $this->getJson('/api/admin/leads')->json('0.photo_attached');
        $this->assertStringStartsWith($stored . '?expires=', $signed);

        $this->get('/uploads/leads/' . $signed)->assertOk();
    }

    public function test_receptionist_can_read_but_not_write_content(): void
    {
        Sanctum::actingAs(User::where('email', 'bangalore.rec@ycdc.com')->first());

        $this->getJson('/api/admin/doctors')->assertOk();
        $this->getJson('/api/admin/leads')->assertOk();
        $this->postJson('/api/admin/doctors', [])->assertForbidden();
        $this->deleteJson('/api/admin/blogs/anything')->assertForbidden();
        $this->putJson('/api/admin/seo/1', [])->assertForbidden();
    }

    public function test_branch_admin_and_super_admin_can_write(): void
    {
        $payload = ['name' => 'A Patient', 'rating' => 5, 'text' => 'Great care'];

        Sanctum::actingAs(User::where('email', 'bangalore.admin@ycdc.com')->first());
        $this->postJson('/api/admin/testimonials', $payload)->assertOk();

        // Super admin passes via Gate::before even without a direct permission
        $super = User::where('email', 'admin@ycdc.com')->first();
        $super->roles->first()->syncPermissions([]);
        app(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();
        Sanctum::actingAs($super->fresh());
        $this->postJson('/api/admin/testimonials', $payload)->assertOk();
    }

    public function test_debug_reset_and_missing_seo_routes_are_gone(): void
    {
        Sanctum::actingAs(User::where('email', 'admin@ycdc.com')->first());

        $this->postJson('/api/leads/reset')->assertNotFound();
        $this->postJson('/api/admin/seo', [])->assertStatus(405);
        $this->deleteJson('/api/admin/seo/1')->assertStatus(405);
    }

    public function test_api_login_is_rate_limited(): void
    {
        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/api/login', ['email' => 'admin@ycdc.com', 'password' => 'wrong'])->assertStatus(401);
        }

        $this->postJson('/api/login', ['email' => 'admin@ycdc.com', 'password' => 'wrong'])->assertStatus(429);
    }

    public function test_seeder_does_not_use_default_passwords(): void
    {
        $this->postJson('/api/login', ['email' => 'admin@ycdc.com', 'password' => 'password'])->assertStatus(401);
    }

    public function test_blade_admin_is_super_admin_only_and_deletes_need_post(): void
    {
        $receptionist = User::where('email', 'bangalore.rec@ycdc.com')->first();
        $receptionist->update(['password' => bcrypt('secret-pass')]);

        $this->post('/admin/login', ['email' => $receptionist->email, 'password' => 'secret-pass'])
            ->assertSessionHasErrors('email');

        $super = User::where('email', 'admin@ycdc.com')->first();
        $super->update(['password' => bcrypt('secret-pass')]);

        $this->post('/admin/login', ['email' => $super->email, 'password' => 'secret-pass'])
            ->assertRedirect(route('admin.dashboard'));

        $this->get('/admin/doctors/1/delete')->assertNotFound();
        $this->get('/admin/logout')->assertStatus(405);

        // Edited views still render, with POST delete forms and the signed photo link
        Storage::fake('local');
        Storage::disk('local')->put(Lead::PHOTO_DIR . '/x.png', base64_decode(self::PNG));
        $lead = Lead::create($this->leadPayload(['photo_attached' => 'x.png']));

        $this->get('/admin/leads')->assertOk()->assertSee('name="_method" value="DELETE"', false)->assertDontSee('/delete"', false);
        $this->get('/admin/leads/' . $lead->id)->assertOk()->assertSee('/uploads/leads/x.png?expires=', false);

        $this->delete('/admin/leads/' . $lead->id)->assertRedirect(route('admin.leads'));
        $this->assertDatabaseCount('leads', 0);

        $this->post('/admin/logout')->assertRedirect(route('admin.login'));
        $this->get('/admin/dashboard')->assertRedirect(route('admin.login'));
    }
}
