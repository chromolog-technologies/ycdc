<?php

namespace App\Notifications;

use App\Models\Lead;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

/**
 * Alerts a branch inbox about a new website lead. Medical history and attachments
 * are deliberately left out of the email; staff read them in the admin portal.
 */
class NewLeadReceived extends Notification
{
    use Queueable;

    public function __construct(public Lead $lead)
    {
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $lead = $this->lead;
        $kind = $lead->concern_type === 'Careers / Job Application' ? 'Job Application' : $lead->type;

        $message = (new MailMessage)
            ->subject("New {$kind} – {$lead->branch}")
            ->greeting("New {$kind} received")
            ->line("**Branch:** {$lead->branch}")
            ->line("**Name:** {$lead->patient_name}")
            ->line("**Phone:** {$lead->patient_phone}");

        if ($lead->patient_email) {
            $message->line("**Email:** {$lead->patient_email}");
        }
        if ($lead->service_requested) {
            $message->line("**Treatment:** {$lead->service_requested}");
        }
        if ($lead->doctor_requested) {
            $message->line("**Doctor:** {$lead->doctor_requested}");
        }
        if ($lead->preferred_date) {
            $message->line("**Preferred slot:** {$lead->preferred_date} {$lead->preferred_time}");
        }
        if ($lead->concern_type) {
            $message->line("**Concern:** {$lead->concern_type}");
        }

        if ($url = config('clinic.admin_portal_url')) {
            $message->action('Open Admin Portal', $url);
        }

        return $message->line('Full details and any attachment are available in the admin portal.');
    }
}
