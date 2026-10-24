<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Service;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;

class TreatmentCrudController extends Controller
{
    public function index()
    {
        return response()->json(Service::orderBy('category')->get());
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|string|max:100',
            'category' => 'required|in:skin,hair,laser,aesthetics',
            'category_name' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'duration' => 'required|string|max:100',
            'price_range' => 'required|string|max:255',
            'description' => 'required|string',
            'science' => 'required|string',
            'treats' => 'required|string',
            'branch' => 'nullable|in:trivandrum,bangalore,both',
            'procedure_type' => 'nullable|in:dermatic,cosmetic',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'active' => 'nullable'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $id = Str::slug($request->id ?: $request->name);

        // Check if ID already exists
        if (Service::where('id', $id)->exists()) {
            return response()->json(['errors' => ['id' => ['The treatment ID or name is already taken.']]], 422);
        }

        $active = filter_var($request->input('active', true), FILTER_VALIDATE_BOOLEAN);

        $treatment = Service::create([
            'id' => $id,
            'category' => $request->category,
            'category_name' => $request->category_name,
            'name' => $request->name,
            'duration' => $request->duration,
            'price_range' => $request->price_range,
            'description' => $request->description,
            'science' => $request->science,
            'treats' => $request->treats,
            'branch' => $request->input('branch', 'trivandrum'),
            'procedure_type' => $request->input('procedure_type', 'cosmetic'),
            'image_path' => $this->storeImage($request),
            'active' => $active
        ]);

        return response()->json(['success' => true, 'data' => $treatment]);
    }

    public function show($id)
    {
        return response()->json(Service::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $treatment = Service::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'category' => 'required|in:skin,hair,laser,aesthetics',
            'category_name' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'duration' => 'required|string|max:100',
            'price_range' => 'required|string|max:255',
            'description' => 'required|string',
            'science' => 'required|string',
            'treats' => 'required|string',
            'branch' => 'nullable|in:trivandrum,bangalore,both',
            'procedure_type' => 'nullable|in:dermatic,cosmetic',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'active' => 'nullable'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $active = filter_var($request->input('active', $treatment->active), FILTER_VALIDATE_BOOLEAN);

        $treatment->update([
            'category' => $request->category,
            'category_name' => $request->category_name,
            'name' => $request->name,
            'duration' => $request->duration,
            'price_range' => $request->price_range,
            'description' => $request->description,
            'science' => $request->science,
            'treats' => $request->treats,
            'branch' => $request->input('branch', $treatment->branch),
            'procedure_type' => $request->input('procedure_type', $treatment->procedure_type),
            'image_path' => $this->storeImage($request) ?? $treatment->image_path,
            'active' => $active
        ]);

        return response()->json(['success' => true, 'data' => $treatment]);
    }

    public function destroy($id)
    {
        $treatment = Service::findOrFail($id);
        $treatment->delete();
        return response()->json(['success' => true]);
    }

    private function storeImage(Request $request): ?string
    {
        if (!$request->hasFile('image')) {
            return null;
        }

        $file = $request->file('image');
        $imageName = time() . '_' . Str::slug($request->name) . '.' . $file->guessExtension();
        $file->move(public_path('uploads/treatments'), $imageName);

        return '/uploads/treatments/' . $imageName;
    }
}
