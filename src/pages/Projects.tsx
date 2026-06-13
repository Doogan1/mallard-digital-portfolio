import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { loadProjects } from '../lib/parseProjects'
import type { SkillCategory } from '../lib/skills'
import { projectHasStackTag, projectMatchesSkillCategory } from '../lib/skills'
import ProjectCard from '../components/ProjectCard'
import FilterBar from '../components/FilterBar'
import styles from './Projects.module.css'

export default function Projects() {
  const projects = loadProjects()
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeSkillCategory, setActiveSkillCategory] = useState<SkillCategory | 'all'>('all')
  const [activeTag, setActiveTag] = useState<string | null>(searchParams.get('tag'))

  function handleTagChange(tag: string | null) {
    setActiveTag(tag)
    setSearchParams(tag ? { tag } : {}, { replace: true })
  }

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (!projectMatchesSkillCategory(p, activeSkillCategory)) return false
      if (activeTag && !projectHasStackTag(p, activeTag)) return false
      return true
    })
  }, [projects, activeSkillCategory, activeTag])

  return (
    <div className={`container fade-in ${styles.page}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Projects</h1>
        <p className={styles.count}>
          {filtered.length} of {projects.length}
        </p>
      </div>

      <FilterBar
        projects={projects}
        activeSkillCategory={activeSkillCategory}
        activeTag={activeTag}
        onSkillCategoryChange={setActiveSkillCategory}
        onTagChange={handleTagChange}
      />

      <div className={styles.grid}>
        {filtered.map((p) => (
          <ProjectCard
            key={p.slug}
            project={p}
            highlightTag={activeTag ?? undefined}
            onTagClick={handleTagChange}
          />
        ))}
        {filtered.length === 0 && (
          <p className={styles.empty}>No projects match the current filters.</p>
        )}
      </div>
    </div>
  )
}
