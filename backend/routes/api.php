<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ApiController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DoctorCrudController;
use App\Http\Controllers\TestimonialCrudController;
use App\Http\Controllers\TreatmentCrudController;
use App\Http\Controllers\GalleryCrudController;
use App\Http\Controllers\LeadCrudController;
use App\Http\Controllers\BlogCrudController;
use App\Http\Controllers\CaseStudyCrudController;
use App\Http\Controllers\SeoCrudController;

// Public APIs
Route::get('/doctors', [ApiController::class, 'getDoctors']);
Route::get('/services', [ApiController::class, 'getServices']);
Route::get('/gallery', [ApiController::class, 'getGallery']);
Route::get('/blog', [ApiController::class, 'getBlogs']);
Route::get('/seo', [ApiController::class, 'getSeo']);
Route::get('/case-studies', [ApiController::class, 'getCaseStudies']);
Route::post('/leads', [ApiController::class, 'createLead'])->middleware('throttle:10,1');

// Public Testimonials
Route::get('/testimonials', function () {
    return response()->json(\App\Models\Testimonial::where('active', true)->orderBy('id', 'desc')->get());
});

// Authentication Routes
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');

// Protected Admin APIs
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    
    // CRUD Endpoints: any staff member may read, writes need the module permission
    $writes = ['store', 'update', 'destroy'];
    Route::apiResource('admin/doctors', DoctorCrudController::class)->middlewareFor($writes, 'permission:manage-doctors');
    Route::apiResource('admin/testimonials', TestimonialCrudController::class)->middlewareFor($writes, 'permission:manage-testimonials');
    Route::apiResource('admin/services', TreatmentCrudController::class)->middlewareFor($writes, 'permission:manage-treatments');
    Route::apiResource('admin/gallery', GalleryCrudController::class)->middlewareFor($writes, 'permission:manage-gallery');
    Route::apiResource('admin/blogs', BlogCrudController::class)->middlewareFor($writes, 'permission:manage-blogs');
    Route::apiResource('admin/case-studies', CaseStudyCrudController::class)->middlewareFor($writes, 'permission:manage-case-studies');
    Route::apiResource('admin/seo', SeoCrudController::class)->only(['index', 'show', 'update'])->middlewareFor('update', 'permission:manage-seo');
    
    // Scoped Leads CRM endpoints
    Route::middleware('permission:manage-leads')->group(function () {
        Route::get('/admin/leads', [LeadCrudController::class, 'index']);
        Route::post('/admin/leads', [LeadCrudController::class, 'store']);
        Route::get('/admin/leads/{id}', [LeadCrudController::class, 'show']);
        Route::put('/admin/leads/{id}', [LeadCrudController::class, 'update']);
        Route::put('/admin/leads/{id}/status', [LeadCrudController::class, 'updateStatus']);
        Route::put('/admin/leads/{id}/notes', [LeadCrudController::class, 'updateNotes']);
        Route::delete('/admin/leads/{id}', [LeadCrudController::class, 'destroy']);
    });
});
