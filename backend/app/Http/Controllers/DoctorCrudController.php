<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Doctor;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;

class DoctorCrudController extends Controller
{
    public function index()
    {
        return response()->json(Doctor::orderBy('id', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'qualification' => 'required|string|max:255',
            'designation' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
            'branch' => 'required|in:bangalore,trivandrum',
            'instagram_url' => 'nullable|url',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'active' => 'nullable'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $imagePath = null;
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $imageName = time() . '_' . Str::slug($request->name) . '.' . $file->guessExtension();
            $file->move(public_path('uploads/doctors'), $imageName);
            $imagePath = '/uploads/doctors/' . $imageName;
        }

        $active = filter_var($request->input('active', true), FILTER_VALIDATE_BOOLEAN);

        $doctor = Doctor::create([
            'name' => $request->name,
            'qualification' => $request->qualification,
            'designation' => $request->designation,
            'bio' => $request->bio,
            'branch' => $request->branch,
            'instagram_url' => $request->instagram_url,
            'active' => $active,
            'image_path' => $imagePath,
        ]);

        return response()->json(['success' => true, 'data' => $doctor]);
    }

    public function show($id)
    {
        return response()->json(Doctor::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $doctor = Doctor::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'qualification' => 'required|string|max:255',
            'designation' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
            'branch' => 'required|in:bangalore,trivandrum',
            'instagram_url' => 'nullable|url',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'active' => 'nullable'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $imagePath = $doctor->image_path;
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $imageName = time() . '_' . Str::slug($request->name) . '.' . $file->guessExtension();
            $file->move(public_path('uploads/doctors'), $imageName);
            $imagePath = '/uploads/doctors/' . $imageName;
        }

        $active = filter_var($request->input('active', $doctor->active), FILTER_VALIDATE_BOOLEAN);

        $doctor->update([
            'name' => $request->name,
            'qualification' => $request->qualification,
            'designation' => $request->designation,
            'bio' => $request->bio,
            'branch' => $request->branch,
            'instagram_url' => $request->instagram_url,
            'active' => $active,
            'image_path' => $imagePath,
        ]);

        return response()->json(['success' => true, 'data' => $doctor]);
    }

    public function destroy($id)
    {
        $doctor = Doctor::findOrFail($id);
        $doctor->delete();
        return response()->json(['success' => true]);
    }
}
