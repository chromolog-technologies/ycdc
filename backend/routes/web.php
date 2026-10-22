<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\AdminController;
use App\Models\Lead;

Route::get('/', function () {
    return redirect('/admin/login');
});

// Private lead attachments (patient photos / CVs), only reachable through the
// short-lived signed links handed out by the authenticated leads API
Route::get('/uploads/leads/{file}', function (string $file) {
    $path = Lead::PHOTO_DIR . '/' . $file;
    abort_unless(Storage::disk('local')->exists($path), 404);

    return response()->file(Storage::disk('local')->path($path), [
        'X-Content-Type-Options' => 'nosniff',
        'Cache-Control' => 'private, no-store',
    ]);
})->where('file', '[A-Za-z0-9._-]+')->middleware('signed:relative')->name('leads.photo');

// Admin Auth Routes
Route::get('/admin/login', [AdminController::class, 'showLogin'])->name('admin.login');
Route::post('/admin/login', [AdminController::class, 'login'])->middleware('throttle:5,1')->name('admin.login.post');
Route::post('/admin/logout', [AdminController::class, 'logout'])->name('admin.logout');

// Protected Admin Dashboard Routes
Route::middleware(['admin.auth'])->prefix('admin')->group(function () {
    Route::get('/', function () {
        return redirect()->route('admin.dashboard');
    });

    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');

    // Doctor Management
    Route::get('/doctors', [AdminController::class, 'doctors'])->name('admin.doctors');
    Route::get('/doctors/create', [AdminController::class, 'createDoctor'])->name('admin.doctors.create');
    Route::post('/doctors/create', [AdminController::class, 'storeDoctor'])->name('admin.doctors.store');
    Route::get('/doctors/{id}/edit', [AdminController::class, 'editDoctor'])->name('admin.doctors.edit');
    Route::post('/doctors/{id}/edit', [AdminController::class, 'updateDoctor'])->name('admin.doctors.update');
    Route::delete('/doctors/{id}', [AdminController::class, 'deleteDoctor'])->name('admin.doctors.delete');

    // Service Management
    Route::get('/services', [AdminController::class, 'services'])->name('admin.services');
    Route::get('/services/create', [AdminController::class, 'createService'])->name('admin.services.create');
    Route::post('/services/create', [AdminController::class, 'storeService'])->name('admin.services.store');
    Route::get('/services/{id}/edit', [AdminController::class, 'editService'])->name('admin.services.edit');
    Route::post('/services/{id}/edit', [AdminController::class, 'updateService'])->name('admin.services.update');
    Route::delete('/services/{id}', [AdminController::class, 'deleteService'])->name('admin.services.delete');

    // Gallery Management
    Route::get('/gallery', [AdminController::class, 'gallery'])->name('admin.gallery');
    Route::get('/gallery/create', [AdminController::class, 'createGallery'])->name('admin.gallery.create');
    Route::post('/gallery/create', [AdminController::class, 'storeGallery'])->name('admin.gallery.store');
    Route::get('/gallery/{id}/edit', [AdminController::class, 'editGallery'])->name('admin.gallery.edit');
    Route::post('/gallery/{id}/edit', [AdminController::class, 'updateGallery'])->name('admin.gallery.update');
    Route::delete('/gallery/{id}', [AdminController::class, 'deleteGallery'])->name('admin.gallery.delete');

    // Blog Management
    Route::get('/blog', [AdminController::class, 'blog'])->name('admin.blog');
    Route::get('/blog/create', [AdminController::class, 'createBlog'])->name('admin.blog.create');
    Route::post('/blog/create', [AdminController::class, 'storeBlog'])->name('admin.blog.store');
    Route::get('/blog/{id}/edit', [AdminController::class, 'editBlog'])->name('admin.blog.edit');
    Route::post('/blog/{id}/edit', [AdminController::class, 'updateBlog'])->name('admin.blog.update');
    Route::delete('/blog/{id}', [AdminController::class, 'deleteBlog'])->name('admin.blog.delete');

    // Lead Management
    Route::get('/leads', [AdminController::class, 'leads'])->name('admin.leads');
    Route::get('/leads/{id}', [AdminController::class, 'viewLead'])->name('admin.leads.view');
    Route::post('/leads/{id}/status', [AdminController::class, 'updateLeadStatus'])->name('admin.leads.status');
    Route::post('/leads/{id}/notes', [AdminController::class, 'updateLeadNotes'])->name('admin.leads.notes');
    Route::delete('/leads/{id}', [AdminController::class, 'deleteLead'])->name('admin.leads.delete');

    // SEO Management
    Route::get('/seo', [AdminController::class, 'seo'])->name('admin.seo');
    Route::post('/seo/{id}/update', [AdminController::class, 'updateSeo'])->name('admin.seo.update');
});
