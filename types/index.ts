export interface Profile {
  id: string;
  name: string;
  title: string;
  about: string;
  short_bio: string;
  email: string;
  phone: string;
  location: string;
  resume_url: string;
  profile_picture: string;
  cover_image: string;
  social_links: SocialLinks;
  updated_at: string;
}

export interface SocialLinks {
  linkedin?: string;
  github?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  website?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  percentage: number;
  icon_url: string;
  order_index: number;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  github_link: string;
  live_link: string;
  featured: boolean;
  category: string;
  status: string;
  created_at: string;
  images?: ProjectImage[];
}

export interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  created_at: string;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  image_url: string;
  date: string;
  created_at: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  field_of_study: string;
  start_date: string;
  end_date: string;
  description: string;
  created_at: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  description: string;
  start_date: string;
  end_date: string;
  current: boolean;
  created_at: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  featured: boolean;
  created_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  position: string;
  company: string;
  content: string;
  avatar_url: string;
  rating: number;
  created_at: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

export interface DashboardStats {
  total_projects: number;
  total_skills: number;
  total_certificates: number;
  total_gallery: number;
  total_contacts: number;
  total_testimonials: number;
  last_updated: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
