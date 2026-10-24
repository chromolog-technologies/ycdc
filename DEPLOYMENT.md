# YCDC — Production Deployment

The project has two parts that are deployed separately:

| Part | Folder | Where it runs |
|---|---|---|
| Website + admin portal (React/Vite) | `frontend/` | Vercel (project root directory: `frontend`) |
| API, CRM and uploads (Laravel 12) | `backend/` | A PHP server you control (see below) |

The website talks to the API through `VITE_API_URL`. Until the backend is live and that variable is set, forms and the admin portal on the live site cannot work.

---

## 1. Backend hosting

Uploaded images are written to `backend/public/uploads/` and patient attachments to `backend/storage/app/private/leads/`. **Both folders must survive redeploys**, so use a host with a persistent disk:

- **Recommended:** a small VPS (e.g. DigitalOcean / AWS Lightsail / Hetzner, 2 GB RAM) managed with Laravel Forge or set up by hand as below.
- cPanel shared hosting with PHP 8.5 also works if it gives SSH + Composer access.
- Avoid hosts with ephemeral disks (default Railway / Render / Heroku containers) unless you attach a persistent volume mounted at both folders above.

### Server requirements
- PHP **8.5** with extensions: `bcmath, ctype, curl, fileinfo, gd, intl, mbstring, openssl, pdo_mysql, tokenizer, xml, zip`
- MySQL 8 (or MariaDB 10.6+)
- Composer 2, Nginx (or Apache), HTTPS certificate (Let's Encrypt)
- Point a subdomain such as `api.ycdc.in` at the server.

### First deploy
```bash
git clone https://github.com/chromolog-technologies/ycdc.git /var/www/ycdc
cd /var/www/ycdc/backend
composer install --no-dev --optimize-autoloader
cp .env.production.example .env        # then fill in DB, mail, lead emails, CORS origins
php artisan key:generate
php artisan migrate --force
php artisan db:seed --force             # first deploy only; prints or uses SEED_ADMIN_PASSWORD
php artisan config:cache && php artisan route:cache && php artisan view:cache
sudo chown -R www-data:www-data storage bootstrap/cache public/uploads
```
Log in to the admin portal and **change every seeded staff password** straight away (Staff accounts API / profile).

### Nginx site (document root must be `backend/public`)
```nginx
server {
    listen 443 ssl http2;
    server_name api.ycdc.in;
    root /var/www/ycdc/backend/public;
    index index.php;

    client_max_body_size 12M;

    location / { try_files $uri $uri/ /index.php?$query_string; }

    # Uploaded media is static only — never execute scripts from it
    location ~* ^/uploads/.*\.(php|phtml|phar|html?|svg|js)$ { deny all; }

    location ~ \.php$ {
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        fastcgi_pass unix:/run/php/php8.5-fpm.sock;
    }

    location ~ /\.(?!well-known) { deny all; }
}
```
Never serve the repository root or `backend/` itself from the web server — only `backend/public`.

### Updating
```bash
cd /var/www/ycdc && git pull
cd backend && composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan config:cache && php artisan route:cache && php artisan view:cache
```

---

## 2. Scheduled jobs, queue and email

Add the Laravel scheduler to the server's crontab (`crontab -e -u www-data`):
```
* * * * * cd /var/www/ycdc/backend && php artisan schedule:run >> /dev/null 2>&1
```
It currently prunes expired admin login tokens daily (`routes/console.php`).

New-lead emails are sent immediately (no worker needed). If you later queue mail, run a worker with Supervisor:
```
php artisan queue:work --sleep=3 --tries=3 --max-time=3600
```

Set real SMTP credentials (`MAIL_*`) and the branch inboxes `LEAD_EMAIL_TRIVANDRUM` / `LEAD_EMAIL_BANGALORE`, then submit a test enquiry from the website to confirm delivery.

---

## 3. Backups

Back up **both** the database and the upload folders, daily, to storage off the server (S3, Backblaze, Google Drive via rclone, …):

```bash
# /etc/cron.daily/ycdc-backup
mysqldump --single-transaction -u ycdc -p"$DB_PASSWORD" ycdc | gzip > /backups/ycdc-db-$(date +%F).sql.gz
tar -czf /backups/ycdc-uploads-$(date +%F).tgz -C /var/www/ycdc/backend public/uploads storage/app/private
find /backups -mtime +30 -delete
# then sync /backups off-site, e.g.: rclone sync /backups remote:ycdc-backups
```
Lead records and attachments contain patient health data — keep backups encrypted and access-restricted, and test a restore once.

---

## 4. Monitoring

- **Uptime:** monitor `https://api.ycdc.in/up` (health check) and the website with a free service such as UptimeRobot / Better Stack; alert by email/WhatsApp.
- **Errors:** logs are in `backend/storage/logs/laravel-YYYY-MM-DD.log` (`LOG_CHANNEL=daily`). Optionally add Sentry or Flare for alerts.
- **Security:** run `composer audit` (backend) and `npm audit --omit=dev` (frontend) before each release.

---

## 5. Website (Vercel)

Project settings → **Root Directory** `frontend`, framework **Vite**. Environment variables (Production):

| Variable | Example | Purpose |
|---|---|---|
| `VITE_API_URL` | `https://api.ycdc.in/api` | Laravel API base |
| `VITE_SITE_URL` | `https://ycdc.in` | Canonical / Open Graph links, `robots.txt`, `sitemap.xml` |
| `VITE_GA_ID` | `G-XXXXXXXXXX` | Google Analytics 4 (leave empty to disable) |

Redeploy after changing variables. `frontend/vercel.json` handles page routing (so `/treatments`, `/contact-us`, … work on refresh), security headers and `noindex` for `/admin`.

**Custom domain:** add `ycdc.in` and `www.ycdc.in` in Vercel → Domains, update DNS as Vercel instructs, then set `VITE_SITE_URL` and add both origins to the backend's `CORS_ALLOWED_ORIGINS`.

---

## 6. Go-live checklist

- [ ] Backend live on HTTPS, `/up` returns 200
- [ ] `.env`: `APP_ENV=production`, `APP_DEBUG=false`, `SESSION_SECURE_COOKIE=true`, correct `APP_URL` and `CORS_ALLOWED_ORIGINS`
- [ ] `php artisan migrate --force` run; seeded passwords changed
- [ ] Scheduler cron and daily backups in place; one restore tested
- [ ] Vercel `VITE_API_URL`, `VITE_SITE_URL`, `VITE_GA_ID` set and redeployed
- [ ] Test on the live site: contact form, appointment booking, online consultation with photo, careers form with CV → leads appear in the right branch and emails arrive
- [ ] Admin portal: log in, edit a treatment with an image, check it on the public page
- [ ] Clinic confirms phone/WhatsApp numbers, NMC compliance of before/after content, and the privacy policy
