export interface AboutUsProps {
  onNavigateToContact: () => void;
}

export interface AnimatedCounterProps {
  target: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

export interface ApplyNowModalProps {
  onClose: () => void;
}

export interface ConsultationFormProps {
  onSuccessClose?: () => void;
}

export interface OurTeamProps {
  onOpenApplyModal: () => void;
}

export interface TreatmentsListProps {
  onBookTreatment: (category: string, serviceId: string) => void;
}

export interface BeforeAfterProps {
  onBookTreatment: (category: string, serviceId: string) => void;
}
