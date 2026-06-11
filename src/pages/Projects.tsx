import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { loadProjects } from '../lib/parseProjects'
import type { ProjectCategory } from '../lib/types'
import ProjectCard from '../components/ProjectCard'
import FilterBar from '../components/FilterBar'
import styles from './Projects.module.css'

export default function Projects() {
  const projects = loadProjects()
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeCategory, setActiveCategory] = useState<ProjectCategory | 'all'>('all')
  const [activeTag, setActiveTag] = useState<string | null>(searchParams.get('tag'))

  function handleTagChange(tag: string | null) {
    setActiveTag(tag)
    setSearchParams(tag ? { tag } : {}, { replace: true })
  }

  const allTags = useMemo(() => {
    const freq = new Map<string, number>()
    projects.forEach((p) => p.stack.forEach((t) => freq.set(t, (freq.get(t) ?? 0) + 1)))
    return Array.from(freq.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => tag)
  }, [projects])

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (activeCategory !== 'all' && p.category !== activeCategory) return false
      if (activeTag && !p.stack.includes(activeTag)) return false
      return true
    })
  }, [projects, activeCategory, activeTag])

  return (
    <div className={`container fade-in ${styles.page}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Projects</h1>
        <p className={styles.count}>
          {filtered.length} of {projects.length}
        </p>
      </div>

      <FilterBar
        activeCategory={activeCategory}
        activeTag={activeTag}
        allTags={allTags}
        onCategoryChange={setActiveCategory}
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
