<?php

namespace App\Models;

use App\Models\Concerns\HasAssetUrls;
use Illuminate\Database\Eloquent\Model;

class GalleryItem extends Model
{
    use HasAssetUrls;

    protected array $assetUrls = ['thumbnail_path' => 'thumbnail_url', 'video_path' => 'video_url'];

    protected $guarded = [];
    public $incrementing = false;
    protected $keyType = 'string';
}
