@extends('admin.layout')

@section('title', 'Leads CRM')
@section('header_title', 'Patient Inquiries (CRM)')

@section('content')
    <div class="card">
        <div class="card-header">
            <h3 class="card-title">Patient Leads Directory</h3>
            
            <!-- Filters bar -->
            <div style="display: flex; gap: 10px; align-items: center;">
                <form action="{{ route('admin.leads') }}" method="GET" style="display: flex; gap: 10px; flex-wrap: wrap;">
                    <select name="type" class="form-control" style="width: auto; padding: 8px 12px; font-size: 0.85rem;" onchange="this.form.submit()">
                        <option value="">All Inquiry Types</option>
                        <option value="Appointment" {{ request('type') === 'Appointment' ? 'selected' : '' }}>Appointments</option>
                        <option value="Online Consultation" {{ request('type') === 'Online Consultation' ? 'selected' : '' }}>Virtual Diagnosis</option>
                        <option value="Contact" {{ request('type') === 'Contact' ? 'selected' : '' }}>Contacts</option>
                    </select>

                    <select name="status" class="form-control" style="width: auto; padding: 8px 12px; font-size: 0.85rem;" onchange="this.form.submit()">
                        <option value="">All Statuses</option>
                        <option value="Pending" {{ request('status') === 'Pending' ? 'selected' : '' }}>Pending Review</option>
                        <option value="Contacted" {{ request('status') === 'Contacted' ? 'selected' : '' }}>Contacted</option>
                        <option value="Confirmed" {{ request('status') === 'Confirmed' ? 'selected' : '' }}>Confirmed Slot</option>
                        <option value="Closed" {{ request('status') === 'Closed' ? 'selected' : '' }}>Closed</option>
                    </select>
                    @if(request('type') || request('status'))
                        <a href="{{ route('admin.leads') }}" class="btn btn-outline btn-sm">Clear Filters</a>
                    @endif
                </form>
            </div>
        </div>

        @if($leads->count() > 0)
            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Date / Time</th>
                            <th>Patient Name</th>
                            <th>Inquiry Type</th>
                            <th>Requested Area</th>
                            <th>Branch</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($leads as $lead)
                            <tr>
                                <td>
                                    <div style="font-weight: 500;">{{ $lead->created_at->format('M d, Y') }}</div>
                                    <div style="font-size: 0.75rem; color: var(--muted-charcoal);">{{ $lead->created_at->format('h:i A') }}</div>
                                </td>
                                <td>
                                    <div style="font-weight: 600; color: var(--plum-900);">{{ $lead->patient_name }}</div>
                                    <div style="font-size: 0.8rem; color: var(--muted-charcoal);">+91 {{ $lead->patient_phone }}</div>
                                    @if($lead->patient_email)
                                        <div style="font-size: 0.8rem; color: var(--muted-charcoal);">{{ $lead->patient_email }}</div>
                                    @endif
                                </td>
                                <td>
                                    <span class="badge" style="background-color: var(--silk-200); color: var(--charcoal);">
                                        {{ $lead->type }}
                                    </span>
                                </td>
                                <td>
                                    @if($lead->type === 'Appointment')
                                        <div style="font-weight: 500; color: var(--plum-800);">{{ $lead->service_requested }}</div>
                                        <div style="font-size: 0.75rem; color: var(--gold-600);">Req. Doctor: {{ $lead->doctor_requested }}</div>
                                    @elseif($lead->type === 'Online Consultation')
                                        <div style="font-weight: 500; color: var(--gold-600);">{{ $lead->concern_type }}</div>
                                        @if($lead->photo_attached)
                                            <div style="font-size: 0.75rem; color: green; font-weight: 500;">📷 Photo Attached</div>
                                        @endif
                                    @else
                                        <span style="font-size: 0.85rem; font-style: italic; color: var(--muted-charcoal);">General Contact Form</span>
                                    @endif
                                </td>
                                <td>{{ $lead->branch }}</td>
                                <td>
                                    <span class="badge badge-{{ strtolower($lead->status) }}">{{ $lead->status }}</span>
                                </td>
                                <td>
                                    <div style="display: flex; gap: 8px;">
                                        <a href="{{ route('admin.leads.view', $lead->id) }}" class="btn btn-outline btn-sm">Manage CRM</a>
                                        <form action="{{ route('admin.leads.delete', $lead->id) }}" method="POST" style="display: inline;" onsubmit="return confirm('Are you sure you want to delete this enquiry lead from CRM?')">@csrf @method('DELETE')<button type="submit" class="btn btn-danger btn-sm">Delete</button></form>
                                    </div>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        @else
            <div style="text-align: center; padding: 40px; color: var(--muted-charcoal);">
                <p>No patient leads matching the criteria were found.</p>
            </div>
        @endif
    </div>
@endsection
