<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;

class Lead extends Model
{
    // Folder on the private "local" disk (storage/app/private) holding lead attachments
    public const PHOTO_DIR = 'leads';

    protected $guarded = [];

    protected static function booted(): void
    {
        // branch_code always follows the branch label, so scoping never relies on text matching
        static::saving(function (Lead $lead) {
            if ($lead->isDirty('branch') || !$lead->branch_code) {
                $lead->branch_code = static::branchCodeFor($lead->branch);
            }
        });
    }

    /**
     * Map a branch label such as "Whitefield Center, Bengaluru" to its code from config/clinic.php.
     */
    public static function branchCodeFor(?string $label): ?string
    {
        $label = strtolower((string) $label);

        foreach (config('clinic.branches') as $code => $branch) {
            foreach ([$code, ...$branch['aliases']] as $alias) {
                if (str_contains($label, $alias)) {
                    return $code;
                }
            }
        }

        return null;
    }

    /**
     * Leads visible to the given staff member: their own branch, or every branch for super admins.
     */
    public function scopeVisibleTo($query, User $user)
    {
        $code = $user->branchCode();

        if ($code) {
            return $query->where('branch_code', $code);
        }

        return $user->hasRole('super-admin') ? $query : $query->whereRaw('1 = 0');
    }

    public function isVisibleTo(User $user): bool
    {
        $code = $user->branchCode();

        return $code ? $this->branch_code === $code : $user->hasRole('super-admin');
    }

    /**
     * Short-lived signed path to the attachment, e.g. /uploads/leads/abc.jpg?expires=..&signature=..
     */
    public function photoUrl(): ?string
    {
        if (!$this->photo_attached) {
            return null;
        }

        return URL::temporarySignedRoute(
            'leads.photo',
            now()->addMinutes(30),
            ['file' => $this->photo_attached],
            absolute: false
        );
    }

    public function toArray()
    {
        $data = parent::toArray();

        // The admin UI builds ".../uploads/leads/{photo_attached}", so expose the
        // filename together with its signature query instead of the bare name
        if ($this->photo_attached) {
            $data['photo_attached'] = Str::after($this->photoUrl(), '/uploads/leads/');
        }

        return $data;
    }
}
