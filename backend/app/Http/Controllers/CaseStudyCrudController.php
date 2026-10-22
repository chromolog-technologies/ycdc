<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CaseStudy;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;

class CaseStudyCrudController extends Controller
{
    public function index()
    {
        return response()->json(CaseStudy::orderBy('id', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|string|max:100',
            'category' => 'required|string|max:100',
            'category_label' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'before_image' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048',
            'after_image' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048',
            'doctor' => 'required|string|max:255',
            'technology' => 'required|string|max:255',
            'sessions' => 'required|string|max:255',
            'concern' => 'required|string|max:255',
            'active' => 'nullable'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $id = Str::slug($request->id ?: $request->title);

        if (CaseStudy::where('id', $id)->exists()) {
            return response()->json(['errors' => ['id' => ['The Case Study ID or title is already taken.']]], 422);
        }

        // Upload images
        $beforeName = time() . '_before_' . $id . '.' . $request->file('before_image')->guessExtension();
        $request->file('before_image')->move(public_path('uploads/casestudies'), $beforeName);
        $beforePath = '/uploads/casestudies/' . $beforeName;

        $afterName = time() . '_after_' . $id . '.' . $request->file('after_image')->guessExtension();
        $request->file('after_image')->move(public_path('uploads/casestudies'), $afterName);
        $afterPath = '/uploads/casestudies/' . $afterName;

        $active = filter_var($request->input('active', true), FILTER_VALIDATE_BOOLEAN);

        $caseStudy = CaseStudy::create([
            'id' => $id,
            'category' => $request->category,
            'category_label' => $request->category_label,
            'title' => $request->title,
            'description' => $request->description,
            'before_img_path' => $beforePath,
            'after_img_path' => $afterPath,
            'doctor' => $request->doctor,
            'technology' => $request->technology,
            'sessions' => $request->sessions,
            'concern' => $request->concern,
            'active' => $active
        ]);

        return response()->json(['success' => true, 'data' => $caseStudy]);
    }

    public function show($id)
    {
        return response()->json(CaseStudy::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $caseStudy = CaseStudy::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'category' => 'required|string|max:100',
            'category_label' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'before_image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'after_image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'doctor' => 'required|string|max:255',
            'technology' => 'required|string|max:255',
            'sessions' => 'required|string|max:255',
            'concern' => 'required|string|max:255',
            'active' => 'nullable'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Before Image Replace
        $beforePath = $caseStudy->before_img_path;
        if ($request->hasFile('before_image')) {
            $beforeName = time() . '_before_' . $id . '.' . $request->file('before_image')->guessExtension();
            $request->file('before_image')->move(public_path('uploads/casestudies'), $beforeName);
            $beforePath = '/uploads/casestudies/' . $beforeName;
        }

        // After Image Replace
        $afterPath = $caseStudy->after_img_path;
        if ($request->hasFile('after_image')) {
            $afterName = time() . '_after_' . $id . '.' . $request->file('after_image')->guessExtension();
            $request->file('after_image')->move(public_path('uploads/casestudies'), $afterName);
            $afterPath = '/uploads/casestudies/' . $afterName;
        }

        $active = filter_var($request->input('active', $caseStudy->active), FILTER_VALIDATE_BOOLEAN);

        $caseStudy->update([
            'category' => $request->category,
            'category_label' => $request->category_label,
            'title' => $request->title,
            'description' => $request->description,
            'before_img_path' => $beforePath,
            'after_img_path' => $afterPath,
            'doctor' => $request->doctor,
            'technology' => $request->technology,
            'sessions' => $request->sessions,
            'concern' => $request->concern,
            'active' => $active
        ]);

        return response()->json(['success' => true, 'data' => $caseStudy]);
    }

    public function destroy($id)
    {
        $caseStudy = CaseStudy::findOrFail($id);
        $caseStudy->delete();
        return response()->json(['success' => true]);
    }
}
