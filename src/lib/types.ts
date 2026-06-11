export type ProjectStatus = 'active' | 'complete' | 'in-progress' | 'archived';
export type ProjectCategory =
  | 'agentic-ai'
  | 'data-engineering'
  | 'full-stack'
  | 'infrastructure'
  | 'platform';

export interface Project {
  title: string;
  slug: string;
  status: ProjectStatus;
  category: ProjectCategory;
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
