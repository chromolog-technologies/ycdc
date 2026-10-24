<?php

namespace Tests\Feature;

use App\Models\Doctor;
use App\Models\Lead;
use App\Models\Service;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class Phase1GapsTest extends TestCase
{
    use RefreshDatabase;

    // 1x1 transparent PNG
    private const PNG = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

    private function admin(): User
    {
        return User::where('email', 'admin@ycdc.com')->first();
    }

    private function treatment(array $extra = []): array
    {
        return array_merge([
            'id' => 'hydrafacial-glow',
            'category' => 'aesthetics',
            'category_name' => 'Cosmetic Aesthetics',
            'name' => 'HydraFacial Glow',
            'duration' => '45 mins',
            'price_range' => '₹4,000 - ₹6,000',
            'description' => 'Deep cleanse and hydration.',
            'science' => 'Vortex extraction and serum infusion.',
            'treats' => 'Dullness, congestion',
        ], $extra);
    }

    public function test_full_database_seed_runs_cleanly(): void
    {
        $this->seed(DatabaseSeeder::class);

        $this->assertSame(37, Service::count());
        $this->assertSame(13, Doctor::count());
        $this->assertSame(0, Service::whereNull('procedure_type')->count());
    }

    public function test_treatment_branch_type_and_image_are_saved_and_exposed(): void
    {
        $this->seed(RolesAndPermissionsSeeder::class);
        Sanctum::actingAs($this->admin());

        $image = UploadedFile::fake()->createWithContent('glow.png', base64_decode(self::PNG));

        $this->post('/api/admin/services', $this->treatment([
            'branch' => 'bangalore',
            'procedure_type' => 'cosmetic',
            'image' => $image,
        ]), ['Accept' => 'application/json'])->assertOk();

        $service = Service::find('hydrafacial-glow');
        $this->assertSame('bangalore', $service->branch);
        $this->assertStringStartsWith('/uploads/treatments/', $service->image_path);
        File::delete(public_path(ltrim($service->image_path, '/')));

        $item = $this->getJson('/api/services')->assertOk()->json('0');
        $this->assertSame('bangalore', $item['branch']);
        $this->assertSame(url($service->image_path), $item['image_url']);

        // Update keeps the image and branch when they aren't sent
        $this->putJson('/api/admin/services/hydrafacial-glow', $this->treatment(['procedure_type' => 'dermatic']))->assertOk();
        $service->refresh();
        $this->assertSame('bangalore', $service->branch);
        $this->assertSame('dermatic', $service->procedure_type);
        $this->assertNotNull($service->image_path);

        $this->postJson('/api/admin/services', $this->treatment(['id' => 'x', 'branch' => 'mumbai']))
            ->assertStatus(422)->assertJsonValidationErrors('branch');
    }

    public function test_asset_urls_are_absolute_only_for_backend_uploads(): void
    {
        $uploaded = Doctor::create(['name' => 'A', 'qualification' => 'MD', 'branch' => 'trivandrum', 'image_path' => '/uploads/doctors/a.jpg']);
        $static = Doctor::create(['name' => 'B', 'qualification' => 'MD', 'branch' => 'trivandrum', 'image_path' => '/doctor_yogiraj.png']);
        $remote = Doctor::create(['name' => 'C', 'qualification' => 'MD', 'branch' => 'trivandrum', 'image_path' => 'https://ycdc.in/a.jpg']);

        $this->assertSame(url('/uploads/doctors/a.jpg'), $uploaded->toArray()['image_url']);
        $this->assertSame('/doctor_yogiraj.png', $static->toArray()['image_url']);
        $this->assertSame('https://ycdc.in/a.jpg', $remote->toArray()['image_url']);
    }

    public function test_lead_exposes_full_signed_photo_url(): void
    {
        Storage::fake('local');
        Storage::disk('local')->put(Lead::PHOTO_DIR . '/x.png', base64_decode(self::PNG));
        $lead = Lead::create(['patient_name' => 'P', 'patient_phone' => '1', 'branch' => 'Pattom, Trivandrum', 'type' => 'Contact', 'photo_attached' => 'x.png']);

        $url = $lead->toArray()['photo_url'];
        $this->assertStringStartsWith(url('/uploads/leads/x.png') . '?expires=', $url);
        $this->get($url)->assertOk();
    }

    public function test_super_admin_manages_staff_accounts(): void
    {
        $this->seed(RolesAndPermissionsSeeder::class);
        Sanctum::actingAs($this->admin());

        $this->getJson('/api/admin/users')->assertOk()->assertJsonCount(5)
            ->assertJsonMissingPath('0.password');

        $id = $this->postJson('/api/admin/users', [
            'name' => 'Kochi Reception', 'email' => 'kochi.rec@ycdc.com', 'password' => 'Welcome2026x',
            'branch' => 'trivandrum', 'role' => 'receptionist',
        ])->assertOk()->assertJsonPath('data.role', 'receptionist')->json('data.id');

        // Weak password, unknown branch and duplicate email are rejected
        $this->postJson('/api/admin/users', [
            'name' => 'X', 'email' => 'kochi.rec@ycdc.com', 'password' => 'short', 'branch' => 'mumbai', 'role' => 'receptionist',
        ])->assertStatus(422)->assertJsonValidationErrors(['email', 'password', 'branch']);

        // Promote, keep password when blank, then new password works
        $this->putJson("/api/admin/users/{$id}", [
            'name' => 'Kochi Admin', 'email' => 'kochi.rec@ycdc.com', 'password' => '', 'branch' => 'trivandrum', 'role' => 'branch-admin',
        ])->assertOk()->assertJsonPath('data.role', 'branch-admin');
        $this->postJson('/api/login', ['email' => 'kochi.rec@ycdc.com', 'password' => 'Welcome2026x'])->assertOk();

        // Can't delete or demote yourself
        $self = $this->admin();
        $this->deleteJson("/api/admin/users/{$self->id}")->assertStatus(422);
        $this->putJson("/api/admin/users/{$self->id}", [
            'name' => $self->name, 'email' => $self->email, 'branch' => 'all', 'role' => 'receptionist',
        ])->assertStatus(422);

        $this->deleteJson("/api/admin/users/{$id}")->assertOk();
        $this->assertDatabaseMissing('users', ['id' => $id]);
    }

    public function test_only_super_admin_can_access_staff_accounts(): void
    {
        $this->seed(RolesAndPermissionsSeeder::class);

        Sanctum::actingAs(User::where('email', 'trivandrum.admin@ycdc.com')->first());
        $this->getJson('/api/admin/users')->assertForbidden();
        $this->postJson('/api/admin/users', [])->assertForbidden();
    }
}
