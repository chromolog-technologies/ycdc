<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Spatie\Permission\Models\Role;

/**
 * Staff accounts for the admin portal (super admins only, see routes/api.php).
 */
class UserCrudController extends Controller
{
    public function index()
    {
        return response()->json(User::with('roles')->orderBy('name')->get()->map(fn (User $user) => $this->present($user)));
    }

    public function show($id)
    {
        return response()->json($this->present(User::findOrFail($id)));
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), $this->rules());

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password,
            'branch' => $request->branch,
        ]);
        $user->syncRoles([$request->role]);

        return response()->json(['success' => true, 'data' => $this->present($user)]);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validator = Validator::make($request->all(), $this->rules($user));

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Don't let a super admin lock themselves out of staff management
        if ($user->is($request->user()) && $request->role !== 'super-admin') {
            return response()->json(['errors' => ['role' => ['You cannot remove your own super admin role.']]], 422);
        }

        $user->fill([
            'name' => $request->name,
            'email' => $request->email,
            'branch' => $request->branch,
        ]);

        // Password is optional on update; a new one also signs the user out of other devices
        if ($request->filled('password')) {
            $user->password = $request->password;
            $user->tokens()->where('id', '!=', optional($request->user()->currentAccessToken())->id)->delete();
        }

        $user->save();
        $user->syncRoles([$request->role]);

        return response()->json(['success' => true, 'data' => $this->present($user->fresh())]);
    }

    public function destroy(Request $request, $id)
    {
        $user = User::findOrFail($id);

        if ($user->is($request->user())) {
            return response()->json(['message' => 'You cannot delete your own account.'], 422);
        }

        $user->tokens()->delete();
        $user->delete();

        return response()->json(['success' => true]);
    }

    private function rules(?User $user = null): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user?->id)],
            'password' => [$user ? 'nullable' : 'required', 'string', Password::min(10)->letters()->numbers()],
            'branch' => ['required', Rule::in(['all', ...array_keys(config('clinic.branches'))])],
            'role' => ['required', Rule::in(Role::pluck('name'))],
        ];
    }

    private function present(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'branch' => $user->branch,
            'role' => $user->getRoleNames()->first(),
            'created_at' => $user->created_at,
        ];
    }
}
