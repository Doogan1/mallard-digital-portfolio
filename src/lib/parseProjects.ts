import matter from 'gray-matter';
import type { Project } from './types';

const modules = import.meta.glob('../../projects/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

export function loadProjects(): Project[] {
  return Object.entries(modules)
    .map(([, raw]) => {
      const { data, content } = matter(raw);
      return { ...data, content } as Project;
    })
    .sort((a, b) => b.year_started - a.year_started);
}

export function getProject(slug: string): Project | undefined {
  return loadProjects().find((p) => p.slug === slug);
}
