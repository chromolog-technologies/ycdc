@extends('admin.layout')

@section('title', 'Manage Services')
@section('header_title', 'Services Directory')

@section('content')
    <div class="card">
        <div class="card-header">
            <h3 class="card-title">Dermatology & Cosmetology Treatments</h3>
            <a href="{{ route('admin.services.create') }}" class="btn btn-primary">Add New Treatment</a>
        </div>

        @if($services->count() > 0)
            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Treatment Name</th>
                            <th>Duration</th>
                            <th>Estimated Price</th>
                            <th>Target Indications</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($services as $service)
                            <tr>
                                <td>
                                    <span class="badge badge-{{ $service->category }}">
                                        {{ $service->category_name }}
                                    </span>
                                </td>
                                <td>
                                    <div style="font-weight: 600; color: var(--plum-900);">{{ $service->name }}</div>
                                    <div style="font-size: 0.75rem; color: var(--muted-charcoal);">Key: {{ $service->id }}</div>
                                </td>
                                <td>{{ $service->duration }}</td>
                                <td style="font-weight: bold; color: var(--gold-600);">{{ $service->price_range }}</td>
                                <td style="max-width: 250px; font-size: 0.85rem; color: var(--muted-charcoal);">
                                    {{ $service->treats }}
                                </td>
                                <td>
                                    <span class="badge" style="background-color: {{ $service->active ? 'rgba(0,128,0,0.1)' : 'rgba(0,0,0,0.05)' }}; color: {{ $service->active ? 'green' : 'var(--muted-charcoal)' }};">
                                        {{ $service->active ? 'Active' : 'Inactive' }}
                                    </span>
                                </td>
                                <td>
                                    <div style="display: flex; gap: 8px;">
                                        <a href="{{ route('admin.services.edit', $service->id) }}" class="btn btn-outline btn-sm">Edit</a>
                                        <form action="{{ route('admin.services.delete', $service->id) }}" method="POST" style="display: inline;" onsubmit="return confirm('Are you sure you want to delete this service?')">@csrf @method('DELETE')<button type="submit" class="btn btn-danger btn-sm">Delete</button></form>
                                    </div>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        @else
            <div style="text-align: center; padding: 40px; color: var(--muted-charcoal);">
                <p>No treatment services configured. Click "Add New Treatment" to add a clinic service.</p>
            </div>
        @endif
    </div>
@endsection
