<?php

namespace App\Models\Concerns;

/**
 * Adds an absolute "*_url" next to each stored file path in API responses, so the
 * website never has to know which host serves uploads. Models list the pairs in
 * $assetUrls, e.g. ['image_path' => 'image_url'].
 */
trait HasAssetUrls
{
    public function toArray()
    {
        $data = parent::toArray();

        foreach ($this->assetUrls as $pathAttribute => $urlAttribute) {
            $data[$urlAttribute] = static::assetUrl($this->getAttribute($pathAttribute));
        }

        return $data;
    }

    public static function assetUrl(?string $path): ?string
    {
        if (!$path) {
            return null;
        }

        // Already absolute (e.g. images hosted on ycdc.in)
        if (preg_match('#^(https?:)?//#i', $path)) {
            return $path;
        }

        // Files uploaded through the admin live on this backend
        if (str_starts_with(ltrim($path, '/'), 'uploads/')) {
            return asset(ltrim($path, '/'));
        }

        // Anything else is a static asset of the website itself, e.g. /doctor_yogiraj.png
        return $path;
    }
}
