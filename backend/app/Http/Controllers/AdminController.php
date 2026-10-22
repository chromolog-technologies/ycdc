<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Doctor;
use App\Models\Service;
use App\Models\GalleryItem;
use App\Models\BlogPost;
use App\Models\Lead;
use App\Models\SeoConfig;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class AdminController extends Controller
{
    // Authentication
    public function showLogin()
    {
        if (session('admin_logged_in')) {
            return redirect()->route('admin.dashboard');
        }
        return view('admin.login');
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        // This legacy panel has no branch scoping, so it is limited to super admins
        if ($user && Hash::check($request->password, $user->password) && $user->hasRole('super-admin')) {
            $request->session()->regenerate();
            session([
                'admin_logged_in' => true,
                'admin_user_id' => $user->id,
                'admin_name' => $user->name,
                'admin_email' => $user->email,
            ]);
            return redirect()->route('admin.dashboard')->with('success', 'Welcome back, Admin!');
        }

        return back()->withErrors(['email' => 'Invalid email or password.'])->withInput();
    }

    public function logout(Request $request)
    {
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->route('admin.login')->with('success', 'Logged out successfully.');
    }

    // Dashboard Index
    public function dashboard()
    {
        $stats = [
            'leads_total' => Lead::count(),
            'leads_pending' => Lead::where('status', 'Pending')->count(),
            'doctors' => Doctor::count(),
            'services' => Service::count(),
            'blogs' => BlogPost::count(),
        ];

        $recentLeads = Lead::orderBy('created_at', 'desc')->take(5)->get();

        return view('admin.dashboard', compact('stats', 'recentLeads'));
    }

    // Doctor Management
    public function doctors()
    {
        $doctors = Doctor::orderBy('id', 'desc')->get();
        return view('admin.doctors', compact('doctors'));
    }

    public function createDoctor()
    {
        return view('admin.doctor_form', ['doctor' => null]);
    }

    public function storeDoctor(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'qualification' => 'required|string|max:255',
            'designation' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
            'branch' => 'required|in:bangalore,trivandrum',
            'instagram_url' => 'nullable|url',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $imageName = time() . '_' . Str::slug($request->name) . '.' . $file->guessExtension();
            $file->move(public_path('uploads/doctors'), $imageName);
            $imagePath = '/uploads/doctors/' . $imageName;
        }

        Doctor::create([
            'name' => $request->name,
            'qualification' => $request->qualification,
            'designation' => $request->designation,
            'bio' => $request->bio,
            'branch' => $request->branch,
            'instagram_url' => $request->instagram_url,
            'active' => $request->has('active'),
            'image_path' => $imagePath,
        ]);

        return redirect()->route('admin.doctors')->with('success', 'Doctor added successfully!');
    }

    public function editDoctor($id)
    {
        $doctor = Doctor::findOrFail($id);
        return view('admin.doctor_form', compact('doctor'));
    }

    public function updateDoctor(Request $request, $id)
    {
        $doctor = Doctor::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'qualification' => 'required|string|max:255',
            'designation' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
            'branch' => 'required|in:bangalore,trivandrum',
            'instagram_url' => 'nullable|url',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $imagePath = $doctor->image_path;
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $imageName = time() . '_' . Str::slug($request->name) . '.' . $file->guessExtension();
            $file->move(public_path('uploads/doctors'), $imageName);
            $imagePath = '/uploads/doctors/' . $imageName;
        }

        $doctor->update([
            'name' => $request->name,
            'qualification' => $request->qualification,
            'designation' => $request->designation,
            'bio' => $request->bio,
            'branch' => $request->branch,
            'instagram_url' => $request->instagram_url,
            'active' => $request->has('active'),
            'image_path' => $imagePath,
        ]);

        return redirect()->route('admin.doctors')->with('success', 'Doctor details updated!');
    }

    public function deleteDoctor($id)
    {
        $doctor = Doctor::findOrFail($id);
        $doctor->delete();
        return redirect()->route('admin.doctors')->with('success', 'Doctor removed.');
    }

    // Service Management
    public function services()
    {
        $services = Service::orderBy('category')->get();
        return view('admin.services', compact('services'));
    }

    public function createService()
    {
        return view('admin.service_form', ['service' => null]);
    }

    public function storeService(Request $request)
    {
        $request->validate([
            'id' => 'required|string|unique:services,id|max:100',
            'category' => 'required|in:skin,hair,laser,aesthetics',
            'category_name' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'duration' => 'required|string|max:100',
            'price_range' => 'required|string|max:255',
            'description' => 'required|string',
            'science' => 'required|string',
            'treats' => 'required|string',
        ]);

        Service::create([
            'id' => Str::slug($request->id),
            'category' => $request->category,
            'category_name' => $request->category_name,
            'name' => $request->name,
            'duration' => $request->duration,
            'price_range' => $request->price_range,
            'description' => $request->description,
            'science' => $request->science,
            'treats' => $request->treats,
            'active' => $request->has('active'),
        ]);

        return redirect()->route('admin.services')->with('success', 'Service created successfully!');
    }

    public function editService($id)
    {
        $service = Service::findOrFail($id);
        return view('admin.service_form', compact('service'));
    }

    public function updateService(Request $request, $id)
    {
        $service = Service::findOrFail($id);

        $request->validate([
            'category' => 'required|in:skin,hair,laser,aesthetics',
            'category_name' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'duration' => 'required|string|max:100',
            'price_range' => 'required|string|max:255',
            'description' => 'required|string',
            'science' => 'required|string',
            'treats' => 'required|string',
        ]);

        $service->update([
            'category' => $request->category,
            'category_name' => $request->category_name,
            'name' => $request->name,
            'duration' => $request->duration,
            'price_range' => $request->price_range,
            'description' => $request->description,
            'science' => $request->science,
            'treats' => $request->treats,
            'active' => $request->has('active'),
        ]);

        return redirect()->route('admin.services')->with('success', 'Service updated!');
    }

    public function deleteService($id)
    {
        $service = Service::findOrFail($id);
        $service->delete();
        return redirect()->route('admin.services')->with('success', 'Service deleted.');
    }

    // Gallery Management
    public function gallery()
    {
        $gallery = GalleryItem::orderBy('type')->get();
        return view('admin.gallery', compact('gallery'));
    }

    public function createGallery()
    {
        return view('admin.gallery_form', ['item' => null]);
    }

    public function storeGallery(Request $request)
    {
        $request->validate([
            'id' => 'required|string|unique:gallery_items,id|max:100',
            'type' => 'required|in:image,video',
            'category' => 'required|in:infrastructure,treatments',
            'title' => 'required|string|max:255',
            'thumbnail' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048',
            'video' => 'nullable|file|mimes:mp4,webm|max:10240',
            'description' => 'required|string',
        ]);

        // Upload Thumbnail
        $thumbName = time() . '_thumb_' . Str::slug($request->title) . '.' . $request->file('thumbnail')->guessExtension();
        $request->file('thumbnail')->move(public_path('uploads/gallery'), $thumbName);
        $thumbPath = '/uploads/gallery/' . $thumbName;

        // Upload Video if any
        $videoPath = null;
        if ($request->type === 'video' && $request->hasFile('video')) {
            $videoFile = $request->file('video');
            $videoName = time() . '_video_' . Str::slug($request->title) . '.' . $videoFile->guessExtension();
            $videoFile->move(public_path('uploads/gallery'), $videoName);
            $videoPath = '/uploads/gallery/' . $videoName;
        }

        GalleryItem::create([
            'id' => Str::slug($request->id),
            'type' => $request->type,
            'category' => $request->category,
            'title' => $request->title,
            'thumbnail_path' => $thumbPath,
            'video_path' => $videoPath,
            'description' => $request->description,
        ]);

        return redirect()->route('admin.gallery')->with('success', 'Gallery item uploaded!');
    }

    public function editGallery($id)
    {
        $item = GalleryItem::findOrFail($id);
        return view('admin.gallery_form', compact('item'));
    }

    public function updateGallery(Request $request, $id)
    {
        $item = GalleryItem::findOrFail($id);

        $request->validate([
            'category' => 'required|in:infrastructure,treatments',
            'title' => 'required|string|max:255',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'video' => 'nullable|file|mimes:mp4,webm|max:10240',
            'description' => 'required|string',
        ]);

        $thumbPath = $item->thumbnail_path;
        if ($request->hasFile('thumbnail')) {
            $thumbName = time() . '_thumb_' . Str::slug($request->title) . '.' . $request->file('thumbnail')->guessExtension();
            $request->file('thumbnail')->move(public_path('uploads/gallery'), $thumbName);
            $thumbPath = '/uploads/gallery/' . $thumbName;
        }

        $videoPath = $item->video_path;
        if ($item->type === 'video' && $request->hasFile('video')) {
            $videoFile = $request->file('video');
            $videoName = time() . '_video_' . Str::slug($request->title) . '.' . $videoFile->guessExtension();
            $videoFile->move(public_path('uploads/gallery'), $videoName);
            $videoPath = '/uploads/gallery/' . $videoName;
        }

        $item->update([
            'category' => $request->category,
            'title' => $request->title,
            'thumbnail_path' => $thumbPath,
            'video_path' => $videoPath,
            'description' => $request->description,
        ]);

        return redirect()->route('admin.gallery')->with('success', 'Gallery item updated!');
    }

    public function deleteGallery($id)
    {
        $item = GalleryItem::findOrFail($id);
        $item->delete();
        return redirect()->route('admin.gallery')->with('success', 'Gallery item deleted.');
    }

    // Blog Management
    public function blog()
    {
        $blogs = BlogPost::orderBy('created_at', 'desc')->get();
        return view('admin.blog', compact('blogs'));
    }

    public function createBlog()
    {
        return view('admin.blog_form', ['blog' => null]);
    }

    public function storeBlog(Request $request)
    {
        $request->validate([
            'id' => 'required|string|unique:blog_posts,id|max:100',
            'category' => 'required|in:skin,hair,anti-aging',
            'category_label' => 'required|string|max:100',
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'read_time' => 'required|string|max:100',
            'excerpt' => 'required|string',
            'body_content' => 'required|string',
            'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        // Upload Cover Image
        $imgName = time() . '_blog_' . Str::slug($request->title) . '.' . $request->file('image')->guessExtension();
        $request->file('image')->move(public_path('uploads/blog'), $imgName);
        $imgPath = '/uploads/blog/' . $imgName;

        // Split body content by double newline or single newline to convert into array of paragraphs
        $paragraphs = preg_split('/\r\n|\r|\n/', $request->body_content);
        $paragraphs = array_filter(array_map('trim', $paragraphs)); // Clear empty values

        BlogPost::create([
            'id' => Str::slug($request->id),
            'category' => $request->category,
            'category_label' => $request->category_label,
            'title' => $request->title,
            'author' => $request->author,
            'date' => date('F d, Y'),
            'read_time' => $request->read_time,
            'excerpt' => $request->excerpt,
            'image_path' => $imgPath,
            'body_content' => array_values($paragraphs),
        ]);

        return redirect()->route('admin.blog')->with('success', 'Blog article published!');
    }

    public function editBlog($id)
    {
        $blog = BlogPost::findOrFail($id);
        
        // Convert paragraphs array back to textarea newline string for editing
        $bodyString = is_array($blog->body_content) ? implode("\n\n", $blog->body_content) : '';
        return view('admin.blog_form', compact('blog', 'bodyString'));
    }

    public function updateBlog(Request $request, $id)
    {
        $blog = BlogPost::findOrFail($id);

        $request->validate([
            'category' => 'required|in:skin,hair,anti-aging',
            'category_label' => 'required|string|max:100',
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'read_time' => 'required|string|max:100',
            'excerpt' => 'required|string',
            'body_content' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $imgPath = $blog->image_path;
        if ($request->hasFile('image')) {
            $imgName = time() . '_blog_' . Str::slug($request->title) . '.' . $request->file('image')->guessExtension();
            $request->file('image')->move(public_path('uploads/blog'), $imgName);
            $imgPath = '/uploads/blog/' . $imgName;
        }

        $paragraphs = preg_split('/\r\n|\r|\n/', $request->body_content);
        $paragraphs = array_filter(array_map('trim', $paragraphs));

        $blog->update([
            'category' => $request->category,
            'category_label' => $request->category_label,
            'title' => $request->title,
            'author' => $request->author,
            'read_time' => $request->read_time,
            'excerpt' => $request->excerpt,
            'image_path' => $imgPath,
            'body_content' => array_values($paragraphs),
        ]);

        return redirect()->route('admin.blog')->with('success', 'Blog article updated!');
    }

    public function deleteBlog($id)
    {
        $blog = BlogPost::findOrFail($id);
        $blog->delete();
        return redirect()->route('admin.blog')->with('success', 'Blog article deleted.');
    }

    // Lead Management CRM
    public function leads(Request $request)
    {
        $status = $request->query('status');
        $type = $request->query('type');

        $query = Lead::orderBy('created_at', 'desc');

        if ($status) {
            $query->where('status', $status);
        }
        if ($type) {
            $query->where('type', $type);
        }

        $leads = $query->get();

        return view('admin.leads', compact('leads'));
    }

    public function viewLead($id)
    {
        $lead = Lead::findOrFail($id);
        return view('admin.lead_view', compact('lead'));
    }

    public function updateLeadStatus(Request $request, $id)
    {
        $lead = Lead::findOrFail($id);
        $request->validate(['status' => 'required|string|in:Pending,Contacted,Confirmed,Closed']);
        
        $lead->update(['status' => $request->status]);
        
        return back()->with('success', 'Lead status updated to ' . $request->status);
    }

    public function updateLeadNotes(Request $request, $id)
    {
        $lead = Lead::findOrFail($id);
        $lead->update(['notes' => $request->notes]);
        
        return back()->with('success', 'Notes saved successfully.');
    }

    public function deleteLead($id)
    {
        $lead = Lead::findOrFail($id);
        $lead->delete();
        return redirect()->route('admin.leads')->with('success', 'Inquiry deleted.');
    }

    // SEO Management
    public function seo()
    {
        $configs = SeoConfig::all();
        return view('admin.seo', compact('configs'));
    }

    public function updateSeo(Request $request, $id)
    {
        $config = SeoConfig::findOrFail($id);
        
        $request->validate([
            'title' => 'required|string|max:255',
            'meta_description' => 'required|string',
            'keywords' => 'nullable|string|max:255',
        ]);

        $config->update([
            'title' => $request->title,
            'meta_description' => $request->meta_description,
            'keywords' => $request->keywords,
        ]);

        return redirect()->route('admin.seo')->with('success', 'SEO configuration updated for ' . $config->route_name);
    }
}
