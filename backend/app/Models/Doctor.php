<?php

namespace App\Models;

use App\Models\Concerns\HasAssetUrls;
use Illuminate\Database\Eloquent\Model;

class Doctor extends Model
{
    use HasAssetUrls;

    protected array $assetUrls = ['image_path' => 'image_url'];

    protected $guarded = [];
}
