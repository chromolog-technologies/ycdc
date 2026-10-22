<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Admin Dashboard') | YCDC Admin Portal</title>
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap" rel="stylesheet">
    <style>
        :root {
            --plum-900: #23071b;
            --plum-800: #3b102f;
            --plum-700: #541743;
            --plum-100: #f0e6ed;
            --gold-600: #a5804d;
            --gold-500: #c49e6c;
            --gold-100: #faf3e8;
            --silk-200: #eae4d8;
            --silk-100: #faf7f2;
            --charcoal: #2c2c2c;
            --muted-charcoal: #666666;
            --shadow-sm: 0 2px 6px rgba(0, 0, 0, 0.05);
            --shadow-md: 0 4px 20px rgba(0, 0, 0, 0.08);
            --transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Inter', sans-serif;
        }

        body {
            background-color: var(--silk-100);
            color: var(--charcoal);
            min-height: 100vh;
            display: flex;
        }

        /* Sidebar Navigation */
        .sidebar {
            width: 260px;
            background: linear-gradient(135deg, var(--plum-900) 0%, var(--plum-800) 100%);
            color: white;
            padding: 30px 0;
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            display: flex;
            flex-direction: column;
            z-index: 100;
            box-shadow: 4px 0 15px rgba(0,0,0,0.15);
        }

        .sidebar-brand {
            padding: 0 24px 30px;
            border-bottom: 1px solid rgba(255,255,255,0.08);
            margin-bottom: 20px;
        }

        .sidebar-brand h2 {
            font-family: 'Playfair Display', serif;
            font-size: 1.8rem;
            color: var(--gold-500);
            letter-spacing: 1px;
        }

        .sidebar-brand p {
            font-size: 0.75rem;
            color: rgba(255,255,255,0.5);
            text-transform: uppercase;
            letter-spacing: 0.1em;
            margin-top: 4px;
        }

        .sidebar-menu {
            list-style: none;
            flex: 1;
            padding: 0 12px;
        }

        .sidebar-menu li {
            margin-bottom: 6px;
        }

        .sidebar-menu a {
            display: flex;
            align-items: center;
            padding: 12px 16px;
            color: rgba(255,255,255,0.75);
            text-decoration: none;
            border-radius: 8px;
            font-size: 0.95rem;
            font-weight: 500;
            transition: var(--transition-smooth);
        }

        .sidebar-menu a:hover {
            background-color: rgba(255,255,255,0.05);
            color: white;
        }

        .sidebar-menu li.active a {
            background-color: var(--gold-600);
            color: white;
            box-shadow: 0 4px 12px rgba(165, 128, 77, 0.3);
        }

        .sidebar-menu i {
            margin-right: 12px;
            font-size: 1.1rem;
            width: 20px;
            text-align: center;
        }

        .sidebar-footer {
            padding: 20px 24px 0;
            border-top: 1px solid rgba(255,255,255,0.08);
        }

        .sidebar-footer a,
        .sidebar-footer button {
            color: rgba(255,255,255,0.6);
            font-size: 0.85rem;
            text-decoration: none;
            display: flex;
            align-items: center;
            transition: var(--transition-smooth);
            background: none;
            border: none;
            padding: 0;
            font-family: inherit;
            cursor: pointer;
        }

        .sidebar-footer a:hover,
        .sidebar-footer button:hover {
            color: var(--gold-500);
        }

        /* Main Content Wrapper */
        .main-wrapper {
            margin-left: 260px;
            flex: 1;
            display: flex;
            flex-direction: column;
            min-height: 100vh;
        }

        /* Top bar Header */
        .topbar {
            height: 70px;
            background-color: white;
            border-bottom: 1px solid var(--silk-200);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 40px;
            box-shadow: var(--shadow-sm);
        }

        .topbar-title h1 {
            font-size: 1.3rem;
            font-weight: 600;
            color: var(--plum-900);
        }

        .topbar-user {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .user-avatar {
            width: 38px;
            height: 38px;
            border-radius: 50%;
            background-color: var(--plum-100);
            color: var(--plum-800);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            border: 2px solid var(--gold-500);
        }

        .user-name {
            font-size: 0.9rem;
            font-weight: 600;
            color: var(--charcoal);
        }

        /* Content Area */
        .content {
            padding: 40px;
            flex: 1;
        }

        /* Utility Components */
        .card {
            background-color: white;
            border-radius: 12px;
            border: 1px solid var(--silk-200);
            box-shadow: var(--shadow-sm);
            padding: 30px;
            margin-bottom: 30px;
        }

        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
            border-bottom: 1px solid var(--silk-100);
            padding-bottom: 16px;
        }

        .card-title {
            font-family: 'Playfair Display', serif;
            font-size: 1.4rem;
            color: var(--plum-900);
        }

        /* Alerts and Toast Messages */
        .alert {
            padding: 14px 20px;
            border-radius: 8px;
            margin-bottom: 24px;
            font-size: 0.95rem;
            display: flex;
            align-items: center;
            gap: 10px;
            border-left: 5px solid transparent;
        }

        .alert-success {
            background-color: #e6f6ec;
            color: #1f7a45;
            border-left-color: #2eaf64;
        }

        .alert-danger {
            background-color: #fcebeb;
            color: #c92c2c;
            border-left-color: #e53e3e;
        }

        /* Form styling */
        .form-group {
            margin-bottom: 20px;
            text-align: left;
        }

        .form-label {
            display: block;
            font-size: 0.85rem;
            font-weight: 600;
            color: var(--plum-800);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 8px;
        }

        .form-control {
            width: 100%;
            padding: 12px 16px;
            border-radius: 6px;
            border: 1px solid var(--silk-200);
            outline: none;
            font-size: 0.95rem;
            background-color: var(--silk-100);
            transition: var(--transition-smooth);
        }

        .form-control:focus {
            border-color: var(--gold-600);
            background-color: white;
            box-shadow: 0 0 0 3px rgba(196, 158, 108, 0.15);
        }

        textarea.form-control {
            resize: vertical;
            min-height: 120px;
        }

        /* Buttons styling */
        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 10px 20px;
            font-size: 0.9rem;
            font-weight: 600;
            border-radius: 6px;
            cursor: pointer;
            transition: var(--transition-smooth);
            text-decoration: none;
            border: 1px solid transparent;
            font-family: inherit;
        }

        .btn-primary {
            background-color: var(--plum-800);
            color: white;
        }

        .btn-primary:hover {
            background-color: var(--plum-700);
            box-shadow: 0 4px 12px rgba(59, 16, 47, 0.2);
        }

        .btn-gold {
            background-color: var(--gold-600);
            color: white;
        }

        .btn-gold:hover {
            background-color: var(--gold-500);
            box-shadow: 0 4px 12px rgba(165, 128, 77, 0.2);
        }

        .btn-outline {
            background-color: transparent;
            border-color: var(--silk-200);
            color: var(--muted-charcoal);
        }

        .btn-outline:hover {
            background-color: var(--silk-100);
            color: var(--charcoal);
        }

        .btn-danger {
            background-color: #e53e3e;
            color: white;
        }

        .btn-danger:hover {
            background-color: #c53030;
        }

        .btn-sm {
            padding: 6px 12px;
            font-size: 0.8rem;
            border-radius: 4px;
        }

        /* Table styling */
        .table-responsive {
            overflow-x: auto;
            border-radius: 8px;
            border: 1px solid var(--silk-200);
        }

        .table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
            font-size: 0.9rem;
            background-color: white;
        }

        .table th {
            background-color: var(--silk-100);
            padding: 14px 18px;
            font-weight: 600;
            color: var(--plum-900);
            border-bottom: 1px solid var(--silk-200);
        }

        .table td {
            padding: 14px 18px;
            border-bottom: 1px solid var(--silk-200);
            vertical-align: middle;
        }

        .table tr:last-child td {
            border-bottom: none;
        }

        .badge {
            display: inline-flex;
            padding: 4px 10px;
            border-radius: 30px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .badge-pending { background-color: rgba(255, 165, 0, 0.1); color: orange; }
        .badge-contacted { background-color: rgba(196, 158, 108, 0.15); color: var(--gold-600); }
        .badge-confirmed { background-color: rgba(0, 128, 0, 0.1); color: green; }
        .badge-closed { background-color: rgba(0, 0, 0, 0.05); color: var(--muted-charcoal); }

        .badge-skin { background-color: rgba(59, 16, 47, 0.1); color: var(--plum-800); }
        .badge-hair { background-color: rgba(165, 128, 77, 0.1); color: var(--gold-600); }
        .badge-laser { background-color: rgba(0, 150, 255, 0.1); color: #007acc; }
        .badge-aesthetics { background-color: rgba(128, 0, 128, 0.1); color: purple; }

        .checkbox-container {
            display: flex;
            align-items: center;
            gap: 10px;
            cursor: pointer;
            user-select: none;
        }

        .checkbox-container input {
            cursor: pointer;
            width: 18px;
            height: 18px;
            accent-color: var(--plum-800);
        }

        /* Details sidebar grid */
        .details-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
        }

        .detail-item {
            margin-bottom: 16px;
        }

        .detail-label {
            font-size: 0.75rem;
            text-transform: uppercase;
            color: var(--muted-charcoal);
            font-weight: bold;
            display: block;
            margin-bottom: 4px;
        }

        .detail-value {
            font-size: 0.95rem;
            font-weight: 500;
            color: var(--charcoal);
        }
    </style>
    @yield('styles')
</head>
<body>

    <!-- Sidebar -->
    <div class="sidebar">
        <div class="sidebar-brand">
            <h2>YCDC</h2>
            <p>Admin Dashboard</p>
        </div>
        <ul class="sidebar-menu">
            <li class="{{ Route::is('admin.dashboard') ? 'active' : '' }}">
                <a href="{{ route('admin.dashboard') }}"><i>📊</i> Overview</a>
            </li>
            <li class="{{ Route::is('admin.leads*') ? 'active' : '' }}">
                <a href="{{ route('admin.leads') }}"><i>👥</i> Leads CRM</a>
            </li>
            <li class="{{ Route::is('admin.doctors*') ? 'active' : '' }}">
                <a href="{{ route('admin.doctors') }}"><i>🩺</i> Doctors</a>
            </li>
            <li class="{{ Route::is('admin.services*') ? 'active' : '' }}">
                <a href="{{ route('admin.services') }}"><i>💆</i> Services</a>
            </li>
            <li class="{{ Route::is('admin.gallery*') ? 'active' : '' }}">
                <a href="{{ route('admin.gallery') }}"><i>🖼️</i> Gallery</a>
            </li>
            <li class="{{ Route::is('admin.blog*') ? 'active' : '' }}">
                <a href="{{ route('admin.blog') }}"><i>📝</i> Blog Content</a>
            </li>
            <li class="{{ Route::is('admin.seo*') ? 'active' : '' }}">
                <a href="{{ route('admin.seo') }}"><i>🔍</i> SEO Settings</a>
            </li>
        </ul>
        <div class="sidebar-footer">
            <form action="{{ route('admin.logout') }}" method="POST">
                @csrf
                <button type="submit"><i>🚪</i> Sign Out</button>
            </form>
        </div>
    </div>

    <!-- Main Wrapper -->
    <div class="main-wrapper">
        <!-- Topbar -->
        <div class="topbar">
            <div class="topbar-title">
                <h1>@yield('header_title', 'System Administration')</h1>
            </div>
            <div class="topbar-user">
                <div class="user-avatar">
                    {{ substr(session('admin_name', 'A'), 0, 2) }}
                </div>
                <div class="user-name">{{ session('admin_name', 'Administrator') }}</div>
            </div>
        </div>

        <!-- Content Area -->
        <div class="content">
            @if(session('success'))
                <div class="alert alert-success">
                    <span>✓</span> {{ session('success') }}
                </div>
            @endif

            @if(session('error'))
                <div class="alert alert-danger">
                    <span>✗</span> {{ session('error') }}
                </div>
            @endif

            @yield('content')
        </div>
    </div>

    @yield('scripts')
</body>
</html>
