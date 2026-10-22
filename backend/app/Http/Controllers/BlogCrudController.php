<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\BlogPost;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;

class BlogCrudController extends Controller
{
    public function index()
    {
        return response()->json(BlogPost::orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|string|max:100',
            'category' => 'required|in:skin,hair,anti-aging',
            'category_label' => 'required|string|max:100',
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'read_time' => 'required|string|max:100',
            'excerpt' => 'required|string',
            'body_content' => 'required|string',
            'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $id = Str::slug($request->id ?: $request->title);

        if (BlogPost::where('id', $id)->exists()) {
            return response()->json(['errors' => ['id' => ['The blog article ID or title is already taken.']]], 422);
        }

        // Upload Cover Image
        $imgName = time() . '_blog_' . Str::slug($request->title) . '.' . $request->file('image')->guessExtension();
        $request->file('image')->move(public_path('uploads/blog'), $imgName);
        $imgPath = '/uploads/blog/' . $imgName;

        // Split body content string into array of paragraphs
        $paragraphs = preg_split('/\r\n|\r|\n/', $request->body_content);
        $paragraphs = array_values(array_filter(array_map('trim', $paragraphs)));

        $blog = BlogPost::create([
            'id' => $id,
            'category' => $request->category,
            'category_label' => $request->category_label,
            'title' => $request->title,
            'author' => $request->author,
            'date' => date('F d, Y'),
            'read_time' => $request->read_time,
            'excerpt' => $request->excerpt,
            'image_path' => $imgPath,
            'body_content' => $paragraphs,
        ]);

        return response()->json(['success' => true, 'data' => $blog]);
    }

    public function show($id)
    {
        return response()->json(BlogPost::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $blog = BlogPost::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'category' => 'required|in:skin,hair,anti-aging',
            'category_label' => 'required|string|max:100',
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'read_time' => 'required|string|max:100',
            'excerpt' => 'required|string',
            'body_content' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $imgPath = $blog->image_path;
        if ($request->hasFile('image')) {
            $imgName = time() . '_blog_' . Str::slug($request->title) . '.' . $request->file('image')->guessExtension();
            $request->file('image')->move(public_path('uploads/blog'), $imgName);
            $imgPath = '/uploads/blog/' . $imgName;
        }

        $paragraphs = preg_split('/\r\n|\r|\n/', $request->body_content);
        $paragraphs = array_values(array_filter(array_map('trim', $paragraphs)));

        $blog->update([
            'category' => $request->category,
            'category_label' => $request->category_label,
            'title' => $request->title,
            'author' => $request->author,
            'read_time' => $request->read_time,
            'excerpt' => $request->excerpt,
            'image_path' => $imgPath,
            'body_content' => $paragraphs,
        ]);

        return response()->json(['success' => true, 'data' => $blog]);
    }

    public function destroy($id)
    {
        $blog = BlogPost::findOrFail($id);
        $blog->delete();
        return response()->json(['success' => true]);
    }
}
