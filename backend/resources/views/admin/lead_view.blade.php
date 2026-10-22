@extends('admin.layout')

@section('title', 'Manage Inquiry #' . $lead->id)
@section('header_title', 'Lead Detail CRM')

@section('content')
    <div style="display: grid; grid-template-columns: 3fr 2fr; gap: 30px; align-items: start;">
        
        <!-- Left Column: Lead details -->
        <div class="card">
            <div class="card-header">
                <div>
                    <span class="badge" style="background-color: var(--silk-200); color: var(--charcoal);">{{ $lead->type }}</span>
                    <h3 class="card-title" style="margin-top: 4px;">Enquiry Details</h3>
                    <p style="font-size: 0.8rem; color: var(--muted-charcoal);">Lead ID: YCDC-{{ str_pad($lead->id, 6, '0', STR_PAD_LEFT) }} | Received {{ $lead->created_at->diffForHumans() }}</p>
                </div>
                <a href="{{ route('admin.leads') }}" class="btn btn-outline btn-sm">Back to CRM</a>
            </div>

            <!-- Detail Grid -->
            <div class="details-grid" style="margin-bottom: 24px;">
                <div class="detail-item">
                    <span class="detail-label">Patient Name</span>
                    <span class="detail-value" style="font-size: 1.1rem; color: var(--plum-900); font-weight: bold;">{{ $lead->patient_name }}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Phone Number</span>
                    <span class="detail-value" style="font-size: 1rem; font-weight: bold;">+91 {{ $lead->patient_phone }}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Email Address</span>
                    <span class="detail-value">{{ $lead->patient_email ?: 'Not provided' }}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Clinic Branch</span>
                    <span class="detail-value">{{ $lead->branch }}</span>
                </div>
            </div>

            <div style="border-top: 1px solid var(--silk-100); padding-top: 20px; margin-bottom: 24px;">
                <h4 style="font-family: 'Playfair Display', serif; color: var(--plum-900); font-size: 1.2rem; margin-bottom: 12px;">Requirements</h4>
                
                @if($lead->type === 'Appointment')
                    <div class="details-grid">
                        <div class="detail-item">
                            <span class="detail-label">Treatment Requested</span>
                            <span class="detail-value" style="color: var(--plum-800); font-weight: 600;">{{ $lead->service_requested }}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Requested Clinician</span>
                            <span class="detail-value">{{ $lead->doctor_requested }}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Preferred Date</span>
                            <span class="detail-value">{{ $lead->preferred_date }}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Preferred Time Slot</span>
                            <span class="detail-value" style="color: var(--gold-600); font-weight: bold;">{{ $lead->preferred_time }}</span>
                        </div>
                    </div>
                    @if($lead->medical_history)
                        <div style="margin-top: 16px; background-color: var(--silk-100); padding: 16px; border-radius: 8px; border: 1px solid var(--silk-200);">
                            <span class="detail-label">Patient Notes / Concerns</span>
                            <p style="font-size: 0.95rem; font-style: italic; color: var(--charcoal); margin-top: 4px;">"{{ $lead->medical_history }}"</p>
                        </div>
                    @endif
                @elseif($lead->type === 'Online Consultation')
                    <div class="details-grid" style="grid-template-columns: 1fr;">
                        <div class="detail-item">
                            <span class="detail-label">Clinical Concern Category</span>
                            <span class="detail-value" style="color: var(--plum-800); font-weight: 600;">{{ $lead->concern_type }}</span>
                        </div>
                        <div class="detail-item" style="margin-top: 10px;">
                            <span class="detail-label">Patient Symptoms / Medical History</span>
                            <div style="background-color: var(--silk-100); padding: 16px; border-radius: 8px; border: 1px solid var(--silk-200); font-style: italic; color: var(--charcoal); margin-top: 4px; line-height: 1.5;">
                                "{{ $lead->medical_history }}"
                            </div>
                        </div>
                    </div>
                    
                    @if($lead->photo_attached)
                        <div style="margin-top: 24px;">
                            <span class="detail-label">Attached Diagnostic Snapshot</span>
                            <div style="margin-top: 8px; max-width: 320px; border-radius: 8px; overflow: hidden; border: 1px solid var(--silk-200); background-color: var(--silk-200);">
                                <!-- Verify if mock upload file name or actual url path -->
                                @if(str_contains($lead->photo_attached, '.'))
                                    @if(Storage::disk('local')->exists(\App\Models\Lead::PHOTO_DIR . '/' . $lead->photo_attached))
                                        <img src="{{ $lead->photoUrl() }}" alt="Screening Attachment" style="width: 100%; object-fit: contain;">
                                    @else
                                        <div style="padding: 30px; text-align: center; color: var(--muted-charcoal); font-size: 0.85rem;">
                                            📸 Mock Attachment: <strong style="color: var(--plum-900);">{{ $lead->photo_attached }}</strong>
                                        </div>
                                    @endif
                                @else
                                    <div style="padding: 30px; text-align: center; color: var(--muted-charcoal);">
                                        No Image File ({{ $lead->photo_attached }})
                                    </div>
                                @endif
                            </div>
                        </div>
                    @endif
                @else
                    <div style="background-color: var(--silk-100); padding: 16px; border-radius: 8px; border: 1px solid var(--silk-200);">
                        <span class="detail-label">General Contact Query</span>
                        <p style="font-size: 0.95rem; font-style: italic; color: var(--charcoal); margin-top: 4px;">"{{ $lead->medical_history }}"</p>
                    </div>
                @endif
            </div>
        </div>

        <!-- Right Column: CRM Administration -->
        <div style="display: flex; flex-direction: column; gap: 30px;">
            <!-- Status Update Card -->
            <div class="card">
                <h4 style="font-family: 'Playfair Display', serif; color: var(--plum-900); font-size: 1.25rem; margin-bottom: 16px; border-bottom: 1px solid var(--silk-100); padding-bottom: 12px;">Inquiry Status</h4>
                
                <div style="margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between;">
                    <span style="font-size: 0.9rem; color: var(--muted-charcoal);">Current Status:</span>
                    <span class="badge badge-{{ strtolower($lead->status) }}" style="font-size: 0.85rem; padding: 6px 14px;">{{ $lead->status }}</span>
                </div>

                <form action="{{ route('admin.leads.status', $lead->id) }}" method="POST">
                    @csrf
                    <div class="form-group">
                        <label class="form-label" for="status">Change Status</label>
                        <select name="status" id="status" class="form-control" onchange="this.form.submit()">
                            <option value="Pending" {{ $lead->status === 'Pending' ? 'selected' : '' }}>Pending Review</option>
                            <option value="Contacted" {{ $lead->status === 'Contacted' ? 'selected' : '' }}>Contacted</option>
                            @if($lead->type === 'Appointment')
                                <option value="Confirmed" {{ $lead->status === 'Confirmed' ? 'selected' : '' }}>Confirmed Slot</option>
                            @else
                                <option value="Reviewed" {{ $lead->status === 'Reviewed' ? 'selected' : '' }}>Reviewed / Solved</option>
                            @endif
                            <option value="Closed" {{ $lead->status === 'Closed' ? 'selected' : '' }}>Closed</option>
                        </select>
                    </div>
                </form>
            </div>

            <!-- Internal Staff Notes Card -->
            <div class="card">
                <h4 style="font-family: 'Playfair Display', serif; color: var(--plum-900); font-size: 1.25rem; margin-bottom: 16px; border-bottom: 1px solid var(--silk-100); padding-bottom: 12px;">Internal Staff Notes</h4>
                
                <form action="{{ route('admin.leads.notes', $lead->id) }}" method="POST">
                    @csrf
                    <div class="form-group">
                        <textarea name="notes" id="notes" class="form-control" style="min-height: 150px;" placeholder="Add notes about call discussions, clinic appointment slots offered, or diagnoses details...">{{ old('notes', $lead->notes) }}</textarea>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%;">Save Notes</button>
                </form>
            </div>

            <!-- Danger Zone delete lead -->
            <div class="card" style="border-color: rgba(229, 62, 62, 0.2); background-color: rgba(229, 62, 62, 0.02);">
                <h4 style="color: #c53030; font-size: 0.9rem; font-weight: bold; text-transform: uppercase; margin-bottom: 12px;">Danger Zone</h4>
                <p style="font-size: 0.8rem; color: var(--muted-charcoal); margin-bottom: 14px;">Once deleted, this patient inquiry record cannot be restored. Please confirm before executing.</p>
                <form action="{{ route('admin.leads.delete', $lead->id) }}" method="POST" onsubmit="return confirm('Permanently delete this inquiry from CRM records?')">
                    @csrf
                    @method('DELETE')
                    <button type="submit" class="btn btn-danger" style="width: 100%; justify-content: center;">Delete Inquiry</button>
                </form>
            </div>
        </div>

    </div>
@endsection
