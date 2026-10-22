@extends('admin.layout')

@section('title', 'Manage Blog Content')
@section('header_title', 'Blog Articles')

@section('content')
    <div class="card">
        <div class="card-header">
            <h3 class="card-title">Published Articles</h3>
            <a href="{{ route('admin.blog.create') }}" class="btn btn-primary">Write New Article</a>
        </div>

        @if($blogs->count() > 0)
            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Cover</th>
                            <th>Title & Author</th>
                            <th>Category</th>
                            <th>Read Time</th>
                            <th>Date Published</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($blogs as $post)
                            <tr>
                                <td>
                                    <div style="width: 70px; height: 50px; border-radius: 4px; overflow: hidden; border: 1px solid var(--silk-200); background-color: var(--silk-200);">
                                        <img src="{{ $post->image_path }}" alt="{{ $post->title }}" style="width: 100%; height: 100%; object-fit: cover;">
                                    </div>
                                </td>
                                <td>
                                    <div style="font-weight: 600; color: var(--plum-900); font-size: 1rem;">{{ $post->title }}</div>
                                    <div style="font-size: 0.8rem; color: var(--muted-charcoal);">By {{ $post->author }}</div>
                                </td>
                                <td>
                                    <span class="badge badge-{{ $post->category }}">
                                        {{ $post->category_label }}
                                    </span>
                                </td>
                                <td>{{ $post->read_time }}</td>
                                <td>{{ $post->date }}</td>
                                <td>
                                    <div style="display: flex; gap: 8px;">
                                        <a href="{{ route('admin.blog.edit', $post->id) }}" class="btn btn-outline btn-sm">Edit</a>
                                        <form action="{{ route('admin.blog.delete', $post->id) }}" method="POST" style="display: inline;" onsubmit="return confirm('Are you sure you want to delete this article?')">@csrf @method('DELETE')<button type="submit" class="btn btn-danger btn-sm">Delete</button></form>
                                    </div>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        @else
            <div style="text-align: center; padding: 40px; color: var(--muted-charcoal);">
                <p>No blog posts published. Click "Write New Article" to write your first clinical insight.</p>
            </div>
        @endif
    </div>
@endsection
