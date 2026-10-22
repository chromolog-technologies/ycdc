@extends('admin.layout')

@section('title', 'Manage Gallery')
@section('header_title', 'Media Gallery')

@section('content')
    <div class="card">
        <div class="card-header">
            <h3 class="card-title">Gallery Media Items</h3>
            <a href="{{ route('admin.gallery.create') }}" class="btn btn-primary">Add New Media</a>
        </div>

        @if($gallery->count() > 0)
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px;">
                @foreach($gallery as $item)
                    <div class="card" style="padding: 0; overflow: hidden; display: flex; flex-direction: column; height: 100%; margin-bottom: 0;">
                        <!-- Media Thumbnail -->
                        <div style="position: relative; height: 180px; background-color: var(--silk-200); display: flex; align-items: center; justify-content: center; overflow: hidden;">
                            <img src="{{ $item->thumbnail_path }}" alt="{{ $item->title }}" style="width: 100%; height: 100%; object-fit: cover;">
                            
                            <span style="position: absolute; top: 12px; left: 12px; background-color: rgba(0,0,0,0.7); color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.7rem; font-weight: bold; text-transform: uppercase; display: flex; align-items: center; gap: 4px;">
                                @if($item->type === 'video')
                                    🎬 VIDEO
                                @else
                                    🖼️ IMAGE
                                @endif
                            </span>

                            <span style="position: absolute; bottom: 12px; right: 12px; background-color: var(--gold-600); color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.7rem; font-weight: bold; text-transform: uppercase;">
                                {{ ucfirst($item->category) }}
                            </span>
                        </div>

                        <!-- Details -->
                        <div style="padding: 20px; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
                            <div>
                                <h4 style="font-family: 'Playfair Display', serif; font-size: 1.15rem; color: var(--plum-900); margin-bottom: 6px;">{{ $item->title }}</h4>
                                <p style="font-size: 0.8rem; color: var(--muted-charcoal); line-height: 1.4; margin-bottom: 12px;">{{ $item->description }}</p>
                                @if($item->video_path)
                                    <div style="font-size: 0.75rem; color: green; font-weight: bold; margin-bottom: 10px;">
                                        ✔ Video Attached: {{ basename($item->video_path) }}
                                    </div>
                                @endif
                            </div>

                            <div style="border-top: 1px solid var(--silk-100); padding-top: 14px; display: flex; justify-content: flex-end; gap: 8px;">
                                <a href="{{ route('admin.gallery.edit', $item->id) }}" class="btn btn-outline btn-sm">Edit</a>
                                <form action="{{ route('admin.gallery.delete', $item->id) }}" method="POST" style="display: inline;" onsubmit="return confirm('Are you sure you want to delete this media item?')">@csrf @method('DELETE')<button type="submit" class="btn btn-danger btn-sm" style="padding: 6px 12px;">Delete</button></form>
                            </div>
                        </div>
                    </div>
                @endforeach
            </div>
        @else
            <div style="text-align: center; padding: 40px; color: var(--muted-charcoal);">
                <p>No media files uploaded. Click "Add New Media" to create gallery entries.</p>
            </div>
        @endif
    </div>
@endsection
