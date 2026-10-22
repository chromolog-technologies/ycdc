<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\GalleryItem;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;

class GalleryCrudController extends Controller
{
    public function index()
    {
        return response()->json(GalleryItem::orderBy('id', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|string|max:100',
            'type' => 'required|in:image,video',
            'category' => 'required|in:infrastructure,treatments',
            'title' => 'required|string|max:255',
            'thumbnail' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048',
            'video' => 'nullable|file|mimes:mp4,webm|max:10240',
            'description' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $id = Str::slug($request->id ?: $request->title);

        if (GalleryItem::where('id', $id)->exists()) {
            return response()->json(['errors' => ['id' => ['The item ID or title is already taken.']]], 422);
        }

        // Upload Thumbnail
        $thumbName = time() . '_thumb_' . Str::slug($request->title) . '.' . $request->file('thumbnail')->guessExtension();
        $request->file('thumbnail')->move(public_path('uploads/gallery'), $thumbName);
        $thumbPath = '/uploads/gallery/' . $thumbName;

        // Upload Video if any
        $videoPath = null;
        if ($request->type === 'video' && $request->hasFile('video')) {
            $videoFile = $request->file('video');
            $videoName = time() . '_video_' . Str::slug($request->title) . '.' . $videoFile->guessExtension();
            $videoFile->move(public_path('uploads/gallery'), $videoName);
            $videoPath = '/uploads/gallery/' . $videoName;
        }

        $item = GalleryItem::create([
            'id' => $id,
            'type' => $request->type,
            'category' => $request->category,
            'title' => $request->title,
            'thumbnail_path' => $thumbPath,
            'video_path' => $videoPath,
            'description' => $request->description,
        ]);

        return response()->json(['success' => true, 'data' => $item]);
    }

    public function show($id)
    {
        return response()->json(GalleryItem::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $item = GalleryItem::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'category' => 'required|in:infrastructure,treatments',
            'title' => 'required|string|max:255',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'video' => 'nullable|file|mimes:mp4,webm|max:10240',
            'description' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $thumbPath = $item->thumbnail_path;
        if ($request->hasFile('thumbnail')) {
            $thumbName = time() . '_thumb_' . Str::slug($request->title) . '.' . $request->file('thumbnail')->guessExtension();
            $request->file('thumbnail')->move(public_path('uploads/gallery'), $thumbName);
            $thumbPath = '/uploads/gallery/' . $thumbName;
        }

        $videoPath = $item->video_path;
        if ($item->type === 'video' && $request->hasFile('video')) {
            $videoFile = $request->file('video');
            $videoName = time() . '_video_' . Str::slug($request->title) . '.' . $videoFile->guessExtension();
            $videoFile->move(public_path('uploads/gallery'), $videoName);
            $videoPath = '/uploads/gallery/' . $videoName;
        }

        $item->update([
            'category' => $request->category,
            'title' => $request->title,
            'thumbnail_path' => $thumbPath,
            'video_path' => $videoPath,
            'description' => $request->description,
        ]);

        return response()->json(['success' => true, 'data' => $item]);
    }

    public function destroy($id)
    {
        $item = GalleryItem::findOrFail($id);
        $item->delete();
        return response()->json(['success' => true]);
    }
}
