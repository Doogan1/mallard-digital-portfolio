export type ProjectStatus =
  | 'planning'
  | 'development'
  | 'pilot'
  | 'live'
  | 'maintained'

export const PROJECT_STATUS_ORDER: ProjectStatus[] = [
  'planning',
  'development',
  'pilot',
  'live',
  'maintained',
]

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  planning: 'Planning',
  development: 'Development',
  pilot: 'Pilot / POC',
  live: 'Live',
  maintained: 'Maintained',
}

/** Shorter labels for compact card layout */
export const PROJECT_STATUS_SHORT_LABELS: Record<ProjectStatus, string> = {
  planning: 'Planning',
  development: 'Development',
  pilot: 'Pilot',
  live: 'Live',
  maintained: 'Maintained',
}

export function getStatusIndex(status: ProjectStatus): number {
  return PROJECT_STATUS_ORDER.indexOf(status)
}
