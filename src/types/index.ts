export interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  problem: string;
  solution: string;
  technologies: string;
  result: string;
  learnings: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SiteContent {
  id: string;
  page_name: string;
  section_name: string;
  content_text: string | null;
  content_data: any | null;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  sender_name: string;
  sender_email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}
