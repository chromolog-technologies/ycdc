export interface ClinicBranch {
  id: string;
  name: string;
  city: string;
  address: string;
  mapUrl?: string;
}

export interface SocialLinks {
  instagram: string;
  drNiranjanaInstagram?: string;
  youtube: string;
  facebook?: string;
  linkedin?: string;
  twitter?: string;
}

export interface AppContextValue {
  brandName: string;
  fullName: string;
  phone: string;
  whatsapp: string;
  email: string;
  workingHours: string;
  branches: ClinicBranch[];
  socialLinks: SocialLinks;
}
