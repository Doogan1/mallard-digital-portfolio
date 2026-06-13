import type { Project } from './types'

export type SkillCategory =
  | 'web-development'
  | 'backend'
  | 'data-engineering'
  | 'cloud-infrastructure'
  | 'ai-ml'
  | 'cms-platform'
  | 'automation'
  | 'other'

export const SKILL_CATEGORY_ORDER: SkillCategory[] = [
  'web-development',
  'backend',
  'data-engineering',
  'cloud-infrastructure',
  'ai-ml',
  'cms-platform',
  'automation',
  'other',
]

export const SKILL_CATEGORIES: Record<
  SkillCategory,
  { label: string; color: string; rgb: string }
> = {
  'web-development': { label: 'Web Development', color: '#4a9eff', rgb: '74, 158, 255' },
  backend: { label: 'Backend', color: '#3dd68c', rgb: '61, 214, 140' },
  'data-engineering': { label: 'Data Engineering', color: '#f5a623', rgb: '245, 166, 35' },
  'cloud-infrastructure': { label: 'Cloud & Infrastructure', color: '#7c6af7', rgb: '124, 106, 247' },
  'ai-ml': { label: 'AI & ML', color: '#ff6b9d', rgb: '255, 107, 157' },
  'cms-platform': { label: 'CMS & Platforms', color: '#50e3c2', rgb: '80, 227, 194' },
  automation: { label: 'Automation & Integration', color: '#94a3b8', rgb: '148, 163, 184' },
  other: { label: 'Other', color: '#7a7f94', rgb: '122, 127, 148' },
}

/** Maps each stack tag string (as written in project frontmatter) to a category. */
export const SKILL_REGISTRY: Record<string, SkillCategory> = {
  // Web Development
  'React': 'web-development',
  'React 18': 'web-development',
  'TypeScript': 'web-development',
  'Vite': 'web-development',
  'D3.js': 'web-development',
  'Chart.js': 'web-development',
  'MapLibre GL JS': 'web-development',
  'Leaflet.js': 'web-development',
  'Custom HTML/JS': 'web-development',
  'SVG': 'web-development',

  // Backend
  'Python': 'backend',
  'FastAPI': 'backend',
  'Node.js': 'backend',
  'Express': 'backend',
  'PHP': 'backend',
  'PHP 8': 'backend',
  'asyncpg': 'backend',

  // Data Engineering
  'PostgreSQL': 'data-engineering',
  'MySQL': 'data-engineering',
  'BigQuery': 'data-engineering',
  'pgvector': 'data-engineering',
  'PostGIS': 'data-engineering',
  'mdbtools': 'data-engineering',
  'Firestore': 'data-engineering',
  'Google Sheets': 'data-engineering',

  // Cloud & Infrastructure
  'Cloud Run': 'cloud-infrastructure',
  'Cloud SQL': 'cloud-infrastructure',
  'Cloud Storage': 'cloud-infrastructure',
  'Cloud KMS': 'cloud-infrastructure',
  'Cloud Armor': 'cloud-infrastructure',
  'Cloud Build': 'cloud-infrastructure',
  'Docker': 'cloud-infrastructure',
  'Firebase Hosting': 'cloud-infrastructure',
  'Nexcess': 'cloud-infrastructure',

  // AI & ML
  'Claude API': 'ai-ml',
  'Anthropic Claude API': 'ai-ml',
  'Anthropic Claude Vision API': 'ai-ml',
  'Anthropic Batch API': 'ai-ml',
  'OpenAI Embeddings': 'ai-ml',
  'Chatbase': 'ai-ml',

  // CMS & Platforms
  'WordPress': 'cms-platform',
  'WP-CLI': 'cms-platform',
  'ACF Pro': 'cms-platform',
  'Custom Plugins': 'cms-platform',
  'Jotform': 'cms-platform',
  'Firebase Auth': 'cms-platform',
  'Brevo': 'cms-platform',

  // Automation & Integration
  'Google Apps Script': 'automation',
  'Looker Studio': 'automation',
}

export function getSkillCategory(tag: string): SkillCategory {
  return SKILL_REGISTRY[tag] ?? 'other'
}

export interface SkillTagStyle {
  background: string
  color: string
  borderColor: string
}

export function getTagStyles(category: SkillCategory, active = false): SkillTagStyle {
  const { color, rgb } = SKILL_CATEGORIES[category]
  return {
    background: `rgba(${rgb}, ${active ? 0.32 : 0.15})`,
    color: active ? color : color,
    borderColor: `rgba(${rgb}, ${active ? 0.55 : 0.28})`,
  }
}

export interface NodeColorSet {
  fill: string
  stroke: string
  text: string
}

export function getNodeColors(
  category: SkillCategory,
  state: 'default' | 'hover' | 'connected' | 'dim',
): NodeColorSet {
  const { color, rgb } = SKILL_CATEGORIES[category]
  switch (state) {
    case 'hover':
      return {
        fill: `rgba(${rgb}, 0.5)`,
        stroke: color,
        text: '#e8eaf0',
      }
    case 'connected':
      return {
        fill: `rgba(${rgb}, 0.28)`,
        stroke: `rgba(${rgb}, 0.65)`,
        text: '#c0c3d0',
      }
    case 'dim':
      return {
        fill: `rgba(${rgb}, 0.06)`,
        stroke: `rgba(${rgb}, 0.15)`,
        text: '#7a7f94',
      }
    default:
      return {
        fill: `rgba(${rgb}, 0.14)`,
        stroke: `rgba(${rgb}, 0.38)`,
        text: '#7a7f94',
      }
  }
}

export function getStackTagFrequency(projects: Project[]): Map<string, number> {
  const freq = new Map<string, number>()
  projects.forEach((p) =>
    p.stack.forEach((t) => freq.set(t, (freq.get(t) ?? 0) + 1)),
  )
  return freq
}

export function getSortedStackTags(projects: Project[]): string[] {
  return Array.from(getStackTagFrequency(projects).entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([tag]) => tag)
}

export function getStackTagsByCategory(projects: Project[]): Map<SkillCategory, string[]> {
  const freq = getStackTagFrequency(projects)
  const grouped = new Map<SkillCategory, string[]>()

  for (const category of SKILL_CATEGORY_ORDER) {
    grouped.set(category, [])
  }

  for (const tag of freq.keys()) {
    const category = getSkillCategory(tag)
    grouped.get(category)!.push(tag)
  }

  for (const tags of grouped.values()) {
    tags.sort((a, b) => (freq.get(b) ?? 0) - (freq.get(a) ?? 0) || a.localeCompare(b))
  }

  return grouped
}

export function projectHasStackTag(project: Project, tag: string): boolean {
  return project.stack.includes(tag)
}

export function projectMatchesSkillCategory(
  project: Project,
  category: SkillCategory | 'all',
): boolean {
  if (category === 'all') return true
  return project.stack.some((tag) => getSkillCategory(tag) === category)
}
