import type { ProjectStatus } from '../lib/projectStatus'
import {
  PROJECT_STATUS_ORDER,
  PROJECT_STATUS_LABELS,
  PROJECT_STATUS_SHORT_LABELS,
  getStatusIndex,
} from '../lib/projectStatus'
import styles from './StatusTrack.module.css'

interface Props {
  status: ProjectStatus
  compact?: boolean
}

export default function StatusTrack({ status, compact = false }: Props) {
  const currentIndex = getStatusIndex(status)
  const labels = compact ? PROJECT_STATUS_SHORT_LABELS : PROJECT_STATUS_LABELS

  return (
    <div
      className={`${styles.track} ${compact ? styles.trackCompact : ''}`}
      role="group"
      aria-label={`Lifecycle stage: ${PROJECT_STATUS_LABELS[status]}`}
    >
      {PROJECT_STATUS_ORDER.map((stage, index) => {
        const isCurrent = index === currentIndex
        const isPast = index < currentIndex
        const isFuture = index > currentIndex

        return (
          <span key={stage} className={styles.stepGroup}>
            {index > 0 && (
              <span
                className={`${styles.connector} ${isPast || isCurrent ? styles.connectorPast : ''}`}
                aria-hidden
              >
                —
              </span>
            )}
            <span
              className={[
                styles.step,
                isCurrent && styles.stepCurrent,
                isPast && styles.stepPast,
                isFuture && styles.stepFuture,
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {isCurrent && (
                <span className={styles.dot} aria-hidden>
                  ●{' '}
                </span>
              )}
              {labels[stage]}
            </span>
          </span>
        )
      })}
    </div>
  )
}
