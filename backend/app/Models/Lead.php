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
