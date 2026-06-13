import { Link } from 'react-router-dom'
import type { Project } from '../lib/types'
import StackTag from './StackTag'
import styles from './ProjectCard.module.css'

interface Props {
  project: Project;
  highlightTag?: string;
  onTagClick?: (tag: string) => void;
}

const STATUS_LABELS: Record<string, string> = {
  active: 'Active',
  complete: 'Complete',
  'in-progress': 'In Progress',
  archived: 'Archived',
};

export default function ProjectCard({ project, highlightTag, onTagClick }: Props) {
  const visibleTags = project.stack.slice(0, 5);

  return (
    <article className={styles.card}>
      <div className={styles.topRow}>
        <span className={`badge badge--${project.status}`}>
          <span className={styles.statusDot} />
          {STATUS_LABELS[project.status]}
        </span>
        <span className="cat-tag">{project.category}</span>
      </div>

      <Link to={`/projects/${project.slug}`} className={styles.titleLink}>
        <h2 className={styles.title}>{project.title}</h2>
      </Link>

      <p className={styles.summary}>{project.summary}</p>

      <div className={styles.footer}>
        <div className={styles.tags}>
          {visibleTags.map((tag) => (
            <StackTag
              key={tag}
              tag={tag}
              filter={!!onTagClick}
              active={highlightTag === tag}
              onClick={onTagClick ? () => onTagClick(tag) : undefined}
            />
          ))}
          {project.stack.length > 5 && (
            <span className={styles.moreTag}>+{project.stack.length - 5}</span>
          )}
        </div>
        <div className={styles.meta}>
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.liveLink}
              onClick={(e) => e.stopPropagation()}
            >
              Live ↗
            </a>
          )}
          <span className={styles.year}>{project.year_started}</span>
        </div>
      </div>
    </article>
  )
}
