<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Lead;
use Illuminate\Support\Facades\Validator;

class LeadCrudController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $status = $request->query('status');
        $type = $request->query('type');

        $query = Lead::orderBy('created_at', 'desc');

        // Apply Branch Scoping
        if ($user->branch === 'trivandrum') {
            $query->where(function($q) {
                $q->where('branch', 'like', '%trivandrum%')
                  ->orWhere('branch', 'like', '%pattom%');
            });
        } elseif ($user->branch === 'bangalore') {
            $query->where(function($q) {
                $q->where('branch', 'like', '%bangalore%')
                  ->orWhere('branch', 'like', '%whitefield%');
            });
        }

        // Apply filters
        if ($status) {
            $query->where('status', $status);
        }
        if ($type) {
            $query->where('type', $type);
        }

        return response()->json($query->get());
    }

    public function show(Request $request, $id)
    {
        $user = $request->user();
        $lead = Lead::findOrFail($id);

        // Verify branch access
        if ($user->branch === 'trivandrum') {
            $isTvm = stripos($lead->branch, 'trivandrum') !== false || stripos($lead->branch, 'pattom') !== false;
            if (!$isTvm) {
                return response()->json(['message' => 'Unauthorized branch access.'], 403);
            }
        } elseif ($user->branch === 'bangalore') {
            $isBlr = stripos($lead->branch, 'bangalore') !== false || stripos($lead->branch, 'whitefield') !== false;
            if (!$isBlr) {
                return response()->json(['message' => 'Unauthorized branch access.'], 403);
            }
        }

        return response()->json($lead);
    }

    public function updateStatus(Request $request, $id)
    {
        $user = $request->user();
        $lead = Lead::findOrFail($id);

        // Verify branch access
        if ($user->branch === 'trivandrum') {
            $isTvm = stripos($lead->branch, 'trivandrum') !== false || stripos($lead->branch, 'pattom') !== false;
            if (!$isTvm) {
                return response()->json(['message' => 'Unauthorized branch access.'], 403);
            }
        } elseif ($user->branch === 'bangalore') {
            $isBlr = stripos($lead->branch, 'bangalore') !== false || stripos($lead->branch, 'whitefield') !== false;
            if (!$isBlr) {
                return response()->json(['message' => 'Unauthorized branch access.'], 403);
            }
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|string|in:Pending,Contacted,Confirmed,Closed',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $lead->update(['status' => $request->status]);

        return response()->json(['success' => true, 'data' => $lead]);
    }

    public function updateNotes(Request $request, $id)
    {
        $user = $request->user();
        $lead = Lead::findOrFail($id);

        // Verify branch access
        if ($user->branch === 'trivandrum') {
            $isTvm = stripos($lead->branch, 'trivandrum') !== false || stripos($lead->branch, 'pattom') !== false;
            if (!$isTvm) {
                return response()->json(['message' => 'Unauthorized branch access.'], 403);
            }
        } elseif ($user->branch === 'bangalore') {
            $isBlr = stripos($lead->branch, 'bangalore') !== false || stripos($lead->branch, 'whitefield') !== false;
            if (!$isBlr) {
                return response()->json(['message' => 'Unauthorized branch access.'], 403);
            }
        }

        $lead->update(['notes' => $request->notes]);

        return response()->json(['success' => true, 'data' => $lead]);
    }

    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        $lead = Lead::findOrFail($id);

        // Verify branch access
        if ($user->branch === 'trivandrum') {
            $isTvm = stripos($lead->branch, 'trivandrum') !== false || stripos($lead->branch, 'pattom') !== false;
            if (!$isTvm) {
                return response()->json(['message' => 'Unauthorized branch access.'], 403);
            }
        } elseif ($user->branch === 'bangalore') {
            $isBlr = stripos($lead->branch, 'bangalore') !== false || stripos($lead->branch, 'whitefield') !== false;
            if (!$isBlr) {
                return response()->json(['message' => 'Unauthorized branch access.'], 403);
            }
        }

        $lead->delete();

        return response()->json(['success' => true]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'patient_name' => 'required|string|max:255',
            'patient_phone' => 'required|string|max:100',
            'patient_email' => 'nullable|email|max:255',
            'branch' => 'required|string|max:255',
            'type' => 'required|string|in:Appointment,Online Consultation,Contact',
            'service_requested' => 'nullable|string|max:255',
            'doctor_requested' => 'nullable|string|max:255',
            'preferred_date' => 'nullable|string|max:255',
            'preferred_time' => 'nullable|string|max:255',
            'concern_type' => 'nullable|string|max:255',
            'medical_history' => 'nullable|string',
            'notes' => 'nullable|string',
            'status' => 'required|string|in:Pending,Contacted,Confirmed,Closed',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $lead = Lead::create($validator->validated());

        return response()->json(['success' => true, 'data' => $lead]);
    }

    public function update(Request $request, $id)
    {
        $user = $request->user();
        $lead = Lead::findOrFail($id);

        // Verify branch access
        if ($user->branch === 'trivandrum') {
            $isTvm = stripos($lead->branch, 'trivandrum') !== false || stripos($lead->branch, 'pattom') !== false;
            if (!$isTvm) {
                return response()->json(['message' => 'Unauthorized branch access.'], 403);
            }
        } elseif ($user->branch === 'bangalore') {
            $isBlr = stripos($lead->branch, 'bangalore') !== false || stripos($lead->branch, 'whitefield') !== false;
            if (!$isBlr) {
                return response()->json(['message' => 'Unauthorized branch access.'], 403);
            }
        }

        $validator = Validator::make($request->all(), [
            'patient_name' => 'required|string|max:255',
            'patient_phone' => 'required|string|max:100',
            'patient_email' => 'nullable|email|max:255',
            'branch' => 'required|string|max:255',
            'type' => 'required|string|in:Appointment,Online Consultation,Contact',
            'service_requested' => 'nullable|string|max:255',
            'doctor_requested' => 'nullable|string|max:255',
            'preferred_date' => 'nullable|string|max:255',
            'preferred_time' => 'nullable|string|max:255',
            'concern_type' => 'nullable|string|max:255',
            'medical_history' => 'nullable|string',
            'notes' => 'nullable|string',
            'status' => 'required|string|in:Pending,Contacted,Confirmed,Closed',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $lead->update($validator->validated());

        return response()->json(['success' => true, 'data' => $lead]);
    }
}
