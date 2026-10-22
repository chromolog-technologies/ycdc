@extends('admin.layout')

@section('title', 'Manage Doctors')
@section('header_title', 'Doctor Directory')

@section('content')
    <div class="card">
        <div class="card-header">
            <h3 class="card-title">Active Medical Staff</h3>
            <a href="{{ route('admin.doctors.create') }}" class="btn btn-primary">Add New Clinician</a>
        </div>

        @if($doctors->count() > 0)
            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Photo</th>
                            <th>Name & Title</th>
                            <th>Qualifications</th>
                            <th>Branch</th>
                            <th>Instagram</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($doctors as $doctor)
                            <tr>
                                <td>
                                    <div style="width: 50px; height: 50px; border-radius: 50%; overflow: hidden; background-color: var(--silk-200); border: 1px solid var(--silk-200); display: flex; align-items: center; justify-content: center;">
                                        @if($doctor->image_path)
                                            <img src="{{ $doctor->image_path }}" alt="{{ $doctor->name }}" style="width: 100%; height: 100%; object-fit: cover;">
                                        @else
                                            <span style="font-size: 1.1rem; font-weight: bold; color: var(--plum-800);">
                                                {{ substr($doctor->name, 4, 1) }}
                                            </span>
                                        @endif
                                    </div>
                                </td>
                                <td>
                                    <div style="font-weight: 600; color: var(--plum-900); font-size: 1rem;">{{ $doctor->name }}</div>
                                    <div style="font-size: 0.8rem; color: var(--gold-600); font-weight: 500;">{{ $doctor->designation }}</div>
                                </td>
                                <td style="max-width: 250px; font-size: 0.85rem; color: var(--muted-charcoal);">
                                    {{ $doctor->qualification }}
                                </td>
                                <td>
                                    <span class="badge" style="background-color: {{ $doctor->branch === 'bangalore' ? 'var(--plum-100)' : 'var(--gold-100)' }}; color: {{ $doctor->branch === 'bangalore' ? 'var(--plum-800)' : 'var(--gold-600)' }};">
                                        {{ ucfirst($doctor->branch) }}
                                    </span>
                                </td>
                                <td>
                                    @if($doctor->instagram_url)
                                        <a href="{{ $doctor->instagram_url }}" target="_blank" style="color: var(--plum-800); text-decoration: none; font-size: 0.85rem; font-weight: 500;">
                                            📸 View IG
                                        </a>
                                    @else
                                        <span style="color: var(--muted-charcoal); font-size: 0.85rem;">None</span>
                                    @endif
                                </td>
                                <td>
                                    <span class="badge" style="background-color: {{ $doctor->active ? 'rgba(0,128,0,0.1)' : 'rgba(0,0,0,0.05)' }}; color: {{ $doctor->active ? 'green' : 'var(--muted-charcoal)' }};">
                                        {{ $doctor->active ? 'Active' : 'Inactive' }}
                                    </span>
                                </td>
                                <td>
                                    <div style="display: flex; gap: 8px;">
                                        <a href="{{ route('admin.doctors.edit', $doctor->id) }}" class="btn btn-outline btn-sm">Edit</a>
                                        <form action="{{ route('admin.doctors.delete', $doctor->id) }}" method="POST" style="display: inline;" onsubmit="return confirm('Are you sure you want to remove this doctor from the directory?')">@csrf @method('DELETE')<button type="submit" class="btn btn-danger btn-sm">Delete</button></form>
                                    </div>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        @else
            <div style="text-align: center; padding: 40px; color: var(--muted-charcoal);">
                <p>No clinicians registered. Click "Add New Clinician" to expand the medical team.</p>
            </div>
        @endif
    </div>
@endsection
