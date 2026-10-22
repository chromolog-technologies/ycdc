<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Lead;
use Illuminate\Support\Facades\Validator;

class LeadCrudController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->query('status');
        $type = $request->query('type');

        // Apply Branch Scoping
        $query = Lead::visibleTo($request->user())->orderBy('created_at', 'desc');

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
        $lead = $this->findVisibleLead($request, $id);

        return response()->json($lead);
    }

    public function updateStatus(Request $request, $id)
    {
        $lead = $this->findVisibleLead($request, $id);

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
        $lead = $this->findVisibleLead($request, $id);

        $lead->update(['notes' => $request->notes]);

        return response()->json(['success' => true, 'data' => $lead]);
    }

    public function destroy(Request $request, $id)
    {
        $lead = $this->findVisibleLead($request, $id);

        $lead->delete();

        return response()->json(['success' => true]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), $this->rules());

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $lead = Lead::create($this->lockToUserBranch($request, $validator->validated()));

        return response()->json(['success' => true, 'data' => $lead]);
    }

    public function update(Request $request, $id)
    {
        $lead = $this->findVisibleLead($request, $id);

        $validator = Validator::make($request->all(), $this->rules());

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $lead->update($this->lockToUserBranch($request, $validator->validated()));

        return response()->json(['success' => true, 'data' => $lead]);
    }

    private function rules(): array
    {
        return [
            'patient_name' => 'required|string|max:255',
            'patient_phone' => 'required|string|max:100',
            'patient_email' => 'nullable|email|max:255',
            'branch' => ['required', 'string', 'max:255', function ($attribute, $value, $fail) {
                if (!Lead::branchCodeFor($value)) {
                    $fail('Please choose a valid clinic branch.');
                }
            }],
            'type' => 'required|string|in:Appointment,Online Consultation,Contact',
            'service_requested' => 'nullable|string|max:255',
            'doctor_requested' => 'nullable|string|max:255',
            'preferred_date' => 'nullable|string|max:255',
            'preferred_time' => 'nullable|string|max:255',
            'concern_type' => 'nullable|string|max:255',
            'medical_history' => 'nullable|string',
            'notes' => 'nullable|string',
            'status' => 'required|string|in:Pending,Contacted,Confirmed,Closed',
        ];
    }

    // Branch staff can only file leads under their own branch, whatever the form sent
    private function lockToUserBranch(Request $request, array $data): array
    {
        $code = $request->user()->branchCode();

        if ($code) {
            $data['branch'] = config("clinic.branches.{$code}.name");
        }

        return $data;
    }

    private function findVisibleLead(Request $request, $id): Lead
    {
        $lead = Lead::findOrFail($id);

        abort_unless($lead->isVisibleTo($request->user()), 403, 'Unauthorized branch access.');

        return $lead;
    }
}
