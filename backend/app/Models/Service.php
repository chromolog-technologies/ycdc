<?php

namespace App\Models;

use App\Models\Concerns\HasAssetUrls;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasAssetUrls;

    protected array $assetUrls = ['image_path' => 'image_url'];

    protected $guarded = [];
    public $incrementing = false;
    protected $keyType = 'string';
}
