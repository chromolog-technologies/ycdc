<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
            'manage-doctors',
            'manage-testimonials',
            'manage-treatments',
            'manage-gallery',
            'manage-leads',
            'manage-blogs',
            'manage-case-studies',
            'manage-seo',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create roles and assign existing permissions
        $superAdminRole = Role::firstOrCreate(['name' => 'super-admin']);
        $superAdminRole->givePermissionTo(Permission::all());

        $branchAdminRole = Role::firstOrCreate(['name' => 'branch-admin']);
        $branchAdminRole->givePermissionTo(Permission::all());

        $receptionistRole = Role::firstOrCreate(['name' => 'receptionist']);
        $receptionistRole->givePermissionTo(['manage-leads']);

        // Define default users
        $users = [
            [
                'name' => 'Super Admin',
                'email' => 'admin@ycdc.com',
                'branch' => 'all',
                'role' => 'super-admin'
            ],
            [
                'name' => 'Trivandrum Branch Admin',
                'email' => 'trivandrum.admin@ycdc.com',
                'branch' => 'trivandrum',
                'role' => 'branch-admin'
            ],
            [
                'name' => 'Bangalore Branch Admin',
                'email' => 'bangalore.admin@ycdc.com',
                'branch' => 'bangalore',
                'role' => 'branch-admin'
            ],
            [
                'name' => 'Trivandrum Receptionist',
                'email' => 'trivandrum.rec@ycdc.com',
                'branch' => 'trivandrum',
                'role' => 'receptionist'
            ],
            [
                'name' => 'Bangalore Receptionist',
                'email' => 'bangalore.rec@ycdc.com',
                'branch' => 'bangalore',
                'role' => 'receptionist'
            ]
        ];

        // Passwords come from SEED_ADMIN_PASSWORD, or a random one per user that is printed once.
        // Existing users keep their current password when the seeder is re-run.
        foreach ($users as $userData) {
            $user = User::firstOrNew(['email' => $userData['email']]);
            $user->name = $userData['name'];
            $user->branch = $userData['branch'];

            if (!$user->exists) {
                $password = env('SEED_ADMIN_PASSWORD') ?: Str::password(16);
                $user->password = Hash::make($password);

                if (!env('SEED_ADMIN_PASSWORD')) {
                    $this->command?->warn("Created {$userData['email']} with password: {$password}");
                }
            }

            $user->save();

            // Sync user role
            $user->syncRoles([$userData['role']]);
        }
    }
}
