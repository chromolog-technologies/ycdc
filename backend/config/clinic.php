<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Clinic Branches
    |--------------------------------------------------------------------------
    |
    | Keyed by branch code (the same value stored in users.branch and
    | leads.branch_code). "aliases" are matched case-insensitively against the
    | branch label sent by the website forms, e.g. "Pattom, Trivandrum" or
    | "Whitefield Center, Bengaluru". "lead_email" receives new-lead alerts.
    |
    */

    'branches' => [
        'trivandrum' => [
            'name' => 'Pattom, Trivandrum',
            'aliases' => ['trivandrum', 'thiruvananthapuram', 'pattom', 'tvm'],
            'lead_email' => env('LEAD_EMAIL_TRIVANDRUM'),
        ],
        'bangalore' => [
            'name' => 'Whitefield, Bangalore',
            'aliases' => ['bangalore', 'bengaluru', 'whitefield', 'blr'],
            'lead_email' => env('LEAD_EMAIL_BANGALORE'),
        ],
    ],

    // Optional link to the React admin portal, shown in new-lead emails
    'admin_portal_url' => env('ADMIN_PORTAL_URL'),

];
