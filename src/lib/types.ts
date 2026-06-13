export type ProjectStatus = 'active' | 'complete' | 'in-progress' | 'archived';

export interface Project {
  title: string;
  slug: string;
  status: ProjectStatus;
  year_started: number;
  year_ended?: number;
  client?: string;
  live_url?: string;
  repo_url?: string;
  featured?: boolean;
  stack: string[];
  summary: string;
  content: string;
}
