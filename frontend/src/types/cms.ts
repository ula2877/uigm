export interface Profile {
  id: number;
  name: string;
  email: string;
  role: "admin";
}

export interface Page {
  id: number;
  slug: string;
  title: string;
  content: ContentBlock[];
  published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ContentBlock {
  type: string;
  data: Record<string, any>;
}

export interface Media {
  id: number;
  filename: string;
  url: string;
  mime_type: string;
  created_at?: string;
}

export interface ReportCMS {
  id: number;
  slug: string;
  title: string;
  description: string;
  file_url: string;
  file_name: string;
  file_size: number;
  format: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}
