<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Doctor;
use App\Models\Service;
use App\Models\GalleryItem;
use App\Models\BlogPost;
use App\Models\Lead;
use App\Models\SeoConfig;
use App\Models\CaseStudy;
use Illuminate\Support\Facades\Validator;

class ApiController extends Controller
{
    public function getDoctors()
    {
        return response()->json(Doctor::where('active', true)->get());
    }

    public function getServices()
    {
        return response()->json(Service::where('active', true)->get());
    }

    public function getGallery()
    {
        return response()->json(GalleryItem::all());
    }

    public function getBlogs()
    {
        return response()->json(BlogPost::orderBy('created_at', 'desc')->get());
    }

    public function getCaseStudies()
    {
        return response()->json(CaseStudy::where('active', true)->get());
    }

    public function getSeo()
    {
        // Return key-value pair of route_name -> seo settings
        return response()->json(SeoConfig::all()->keyBy('route_name'));
    }

    public function createLead(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'patient_name' => 'required|string|max:255',
            'patient_phone' => 'required|string|max:20',
            'branch' => 'required|string|max:255',
            'type' => 'required|string|in:Appointment,Online Consultation,Contact',
            // Patient photos (screenings) or CVs (careers form)
            'photo_attached' => 'nullable|file|mimes:jpg,jpeg,png,webp,heic,heif,pdf,doc,docx|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Store attachments on the private disk under a random, content-derived name;
        // they are only reachable through the signed route in routes/web.php
        $photoName = null;
        if ($request->hasFile('photo_attached')) {
            $photoName = basename($request->file('photo_attached')->store(Lead::PHOTO_DIR, 'local'));
        }

        $lead = Lead::create([
            'patient_name' => $request->input('patient_name'),
            'patient_phone' => $request->input('patient_phone'),
            'patient_email' => $request->input('patient_email'),
            'branch' => $request->input('branch'),
            'type' => $request->input('type'),
            'service_requested' => $request->input('service_requested'),
            'doctor_requested' => $request->input('doctor_requested'),
            'preferred_date' => $request->input('preferred_date'),
            'preferred_time' => $request->input('preferred_time'),
            'concern_type' => $request->input('concern_type'),
            'medical_history' => $request->input('medical_history'),
            'photo_attached' => $photoName,
            'status' => 'Pending',
            'notes' => $request->input('notes'),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Your inquiry has been submitted successfully!',
            'lead' => $lead
        ], 201);
    }

    public function getLeads()
    {
        return response()->json(Lead::orderBy('created_at', 'desc')->get());
    }

    public function updateLeadStatus(Request $request, $id)
    {
        $lead = Lead::findOrFail($id);
        $lead->status = $request->input('status');
        $lead->save();

        return response()->json([
            'success' => true,
            'message' => 'Status updated successfully',
            'lead' => $lead
        ]);
    }

    public function deleteLead($id)
    {
        $lead = Lead::findOrFail($id);
        $lead->delete();

        return response()->json([
            'success' => true,
            'message' => 'Lead deleted successfully'
        ]);
    }
}
