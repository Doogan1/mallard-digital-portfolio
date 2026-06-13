import { useParams, Link, Navigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getProject } from '../lib/parseProjects'
import {
  getSkillCategory,
  SKILL_CATEGORIES,
  SKILL_CATEGORY_ORDER,
} from '../lib/skills'
import StackTag from '../components/StackTag'
import styles from './ProjectPage.module.css'

const STATUS_LABELS: Record<string, string> = {
  active: 'Active',
  complete: 'Complete',
  'in-progress': 'In Progress',
  archived: 'Archived',
}

export default function ProjectPage() {
  const { slug } = useParams<{ slug: string }>()
  const project = getProject(slug ?? '')

  if (!project) return <Navigate to="/projects" replace />

  const stackByCategory = SKILL_CATEGORY_ORDER.map((category) => ({
    category,
    tags: project.stack.filter((tag) => getSkillCategory(tag) === category),
  })).filter((group) => group.tags.length > 0)

  return (
    <div className={`fade-in ${styles.page}`}>
      <div className="container">
        <Link to="/projects" className={styles.back}>
          ← All projects
        </Link>
      </div>

      <div className={`container ${styles.layout}`}>
        {/* Main content */}
        <article className={styles.main}>
          <header className={styles.articleHeader}>
            <div className={styles.headerMeta}>
              <span className={`badge badge--${project.status}`}>
                <span className={styles.dot} />
                {STATUS_LABELS[project.status]}
              </span>
              <span className="cat-tag">{project.category}</span>
            </div>
            <h1 className={styles.title}>{project.title}</h1>
            <p className={styles.summary}>{project.summary}</p>
          </header>

          <div className="prose">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {project.content}
            </ReactMarkdown>
          </div>
        </article>

        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarCard}>
            {project.live_url && (
              <div className={styles.sidebarSection}>
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.liveButton}
                >
                  View Live Site ↗
                </a>
              </div>
            )}

            {project.repo_url && (
              <div className={styles.sidebarSection}>
                <a
                  href={project.repo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.repoLink}
                >
                  Repository ↗
                </a>
              </div>
            )}

            <div className={styles.sidebarSection}>
              <p className={styles.sidebarLabel}>Client</p>
              <p className={styles.sidebarValue}>{project.client ?? 'Personal'}</p>
            </div>

            <div className={styles.sidebarSection}>
              <p className={styles.sidebarLabel}>Timeline</p>
              <p className={styles.sidebarValue}>
                {project.year_started}
                {project.year_ended ? ` – ${project.year_ended}` : ' – present'}
              </p>
            </div>

            <div className={styles.sidebarSection}>
              <p className={styles.sidebarLabel}>Stack</p>
              <div className={styles.stackGroups}>
                {stackByCategory.map(({ category, tags }) => (
                  <div key={category} className={styles.stackGroup}>
                    <p
                      className={styles.stackGroupLabel}
                      style={{ color: SKILL_CATEGORIES[category].color }}
                    >
                      {SKILL_CATEGORIES[category].label}
                    </p>
                    <div className={styles.tagList}>
                      {tags.map((tag) => (
                        <StackTag key={tag} tag={tag} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
