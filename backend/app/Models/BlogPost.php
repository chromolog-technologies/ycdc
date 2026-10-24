<?php

namespace App\Models;

use App\Models\Concerns\HasAssetUrls;
use Illuminate\Database\Eloquent\Model;

class BlogPost extends Model
{
    use HasAssetUrls;

    protected array $assetUrls = ['image_path' => 'image_url'];

    protected $guarded = [];
    public $incrementing = false;
    protected $keyType = 'string';
    
    protected $casts = [
        'body_content' => 'array',
    ];
}
