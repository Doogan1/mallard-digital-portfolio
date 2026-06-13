import { useParams, Link, Navigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getProject } from '../lib/parseProjects'
import {
  getSkillCategory,
  getProjectSkillCategories,
  SKILL_CATEGORIES,
  SKILL_CATEGORY_ORDER,
} from '../lib/skills'
import SkillCategoryBadge from '../components/SkillCategoryBadge'
import StackTag from '../components/StackTag'
import StatusTrack from '../components/StatusTrack'
import styles from './ProjectPage.module.css'

export default function ProjectPage() {
  const { slug } = useParams<{ slug: string }>()
  const project = getProject(slug ?? '')

  if (!project) return <Navigate to="/projects" replace />

  const skillCategories = getProjectSkillCategories(project)
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
              <div className={styles.categoryTags}>
                {skillCategories.map((category) => (
                  <SkillCategoryBadge key={category} category={category} />
                ))}
              </div>
            </div>
            <h1 className={styles.title}>{project.title}</h1>
            <p className={styles.summary}>{project.summary}</p>
            <div className={styles.statusTrack}>
              <StatusTrack status={project.status} />
            </div>
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
