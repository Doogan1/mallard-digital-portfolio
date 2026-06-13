import { Link } from 'react-router-dom'
import type { Project } from '../lib/types'
import { getProjectSkillCategories } from '../lib/skills'
import SkillCategoryBadge from './SkillCategoryBadge'
import StackTag from './StackTag'
import StatusTrack from './StatusTrack'
import styles from './ProjectCard.module.css'

interface Props {
  project: Project;
  highlightTag?: string;
  onTagClick?: (tag: string) => void;
}

export default function ProjectCard({ project, highlightTag, onTagClick }: Props) {
  const visibleTags = project.stack.slice(0, 5)
  const skillCategories = getProjectSkillCategories(project)

  return (
    <article className={styles.card}>
      <div className={styles.topRow}>
        <div className={styles.categoryTags}>
          {skillCategories.map((category) => (
            <SkillCategoryBadge key={category} category={category} />
          ))}
        </div>
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

      <StatusTrack status={project.status} compact />
    </article>
  )
}
