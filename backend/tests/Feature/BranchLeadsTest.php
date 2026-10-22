<?php

namespace Tests\Feature;

use App\Models\Lead;
use App\Models\User;
use App\Notifications\NewLeadReceived;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Notifications\AnonymousNotifiable;
use Illuminate\Support\Facades\Notification;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class BranchLeadsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolesAndPermissionsSeeder::class);

        config([
            'clinic.branches.trivandrum.lead_email' => 'tvm@example.test',
            'clinic.branches.bangalore.lead_email' => 'blr@example.test',
        ]);
    }

    private function user(string $email): User
    {
        return User::where('email', $email)->first();
    }

    private function lead(string $branch, array $extra = []): Lead
    {
        return Lead::create(array_merge([
            'patient_name' => 'Patient',
            'patient_phone' => '9999999999',
            'branch' => $branch,
            'type' => 'Appointment',
            'status' => 'Pending',
        ], $extra));
    }

    private function adminPayload(string $branch): array
    {
        return [
            'patient_name' => 'Walk In',
            'patient_phone' => '9888888888',
            'branch' => $branch,
            'type' => 'Appointment',
            'status' => 'Pending',
        ];
    }

    public function test_every_website_branch_label_maps_to_a_branch_code(): void
    {
        // Labels sent by ContactUs, BookingWidget, ConsultationForm and ApplyNowModal
        $this->assertSame('trivandrum', Lead::branchCodeFor('Pattom, Trivandrum'));
        $this->assertSame('trivandrum', Lead::branchCodeFor('Pattom Center, Thiruvananthapuram'));
        $this->assertSame('bangalore', Lead::branchCodeFor('Whitefield, Bangalore'));
        $this->assertSame('bangalore', Lead::branchCodeFor('Whitefield Center, Bengaluru'));
        $this->assertNull(Lead::branchCodeFor('Mumbai'));
    }

    public function test_public_lead_gets_branch_code_and_emails_that_branch_only(): void
    {
        Notification::fake();

        $this->postJson('/api/leads', [
            'patient_name' => 'Asha',
            'patient_phone' => '9447000000',
            'branch' => 'Whitefield Center, Bengaluru',
            'type' => 'Contact',
            'concern_type' => 'Careers / Job Application',
        ])->assertCreated();

        $this->assertSame('bangalore', Lead::first()->branch_code);

        Notification::assertSentOnDemand(NewLeadReceived::class, function ($notification, $channels, AnonymousNotifiable $notifiable) {
            return $notifiable->routes['mail'] === 'blr@example.test'
                && str_contains($notification->toMail($notifiable)->subject, 'Job Application');
        });
        Notification::assertSentOnDemandTimes(NewLeadReceived::class, 1);
    }

    public function test_public_lead_with_unknown_branch_is_rejected(): void
    {
        Notification::fake();

        $this->postJson('/api/leads', [
            'patient_name' => 'Bot',
            'patient_phone' => '1234567890',
            'branch' => 'Nowhere',
            'type' => 'Contact',
        ])->assertStatus(422)->assertJsonValidationErrors('branch');

        $this->assertDatabaseCount('leads', 0);
        Notification::assertNothingSent();
    }

    public function test_lead_is_saved_even_when_email_fails(): void
    {
        config(['mail.default' => 'smtp', 'mail.mailers.smtp.host' => 'invalid.host.test', 'mail.mailers.smtp.port' => 1]);

        $this->postJson('/api/leads', [
            'patient_name' => 'Ravi',
            'patient_phone' => '9447000001',
            'branch' => 'Pattom, Trivandrum',
            'type' => 'Appointment',
        ])->assertCreated();

        $this->assertDatabaseCount('leads', 1);
    }

    public function test_branch_staff_see_only_their_branch(): void
    {
        $tvm = $this->lead('Pattom, Trivandrum');
        $blr = $this->lead('Whitefield, Bangalore');

        foreach (['trivandrum.admin@ycdc.com', 'trivandrum.rec@ycdc.com'] as $email) {
            Sanctum::actingAs($this->user($email));
            $this->getJson('/api/admin/leads')->assertOk()->assertJsonCount(1)->assertJsonPath('0.id', $tvm->id);
            $this->getJson("/api/admin/leads/{$blr->id}")->assertForbidden();
            $this->putJson("/api/admin/leads/{$blr->id}/status", ['status' => 'Closed'])->assertForbidden();
            $this->deleteJson("/api/admin/leads/{$blr->id}")->assertForbidden();
        }

        Sanctum::actingAs($this->user('admin@ycdc.com'));
        $this->getJson('/api/admin/leads')->assertOk()->assertJsonCount(2);
    }

    public function test_branch_admin_cannot_file_or_move_a_lead_to_another_branch(): void
    {
        Sanctum::actingAs($this->user('trivandrum.admin@ycdc.com'));

        $id = $this->postJson('/api/admin/leads', $this->adminPayload('Whitefield, Bangalore'))
            ->assertOk()->json('data.id');
        $this->assertSame('trivandrum', Lead::find($id)->branch_code);
        $this->assertSame('Pattom, Trivandrum', Lead::find($id)->branch);

        $this->putJson("/api/admin/leads/{$id}", $this->adminPayload('Whitefield, Bangalore'))->assertOk();
        $this->assertSame('trivandrum', Lead::find($id)->branch_code);
    }

    public function test_super_admin_can_file_leads_for_either_branch(): void
    {
        Sanctum::actingAs($this->user('admin@ycdc.com'));

        $id = $this->postJson('/api/admin/leads', $this->adminPayload('Whitefield, Bangalore'))
            ->assertOk()->json('data.id');
        $this->assertSame('bangalore', Lead::find($id)->branch_code);

        $this->postJson('/api/admin/leads', $this->adminPayload('Nowhere'))->assertStatus(422);
    }

    public function test_all_branch_accounts_see_nothing_unless_super_admin(): void
    {
        $this->lead('Pattom, Trivandrum');

        // 'all' is the column default, so a new staff account without a branch must not see every lead
        $user = User::create(['name' => 'No Branch', 'email' => 'nobranch@ycdc.com', 'password' => 'x', 'branch' => 'all']);
        $user->assignRole('receptionist');

        Sanctum::actingAs($user);
        $this->getJson('/api/admin/leads')->assertOk()->assertJsonCount(0);
    }
}
