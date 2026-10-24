<?php

namespace App\Models;

use App\Models\Concerns\HasAssetUrls;
use Illuminate\Database\Eloquent\Model;

class CaseStudy extends Model
{
    use HasAssetUrls;

    protected array $assetUrls = ['before_img_path' => 'before_img_url', 'after_img_path' => 'after_img_url'];

    protected $guarded = [];
    public $incrementing = false;
    protected $keyType = 'string';
}
