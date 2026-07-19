import { loadProjects } from '../lib/parseProjects'
import SkillsNetwork from '../components/SkillsNetwork'
import styles from './Skills.module.css'

export default function Skills() {
  const projectCount = loadProjects().length

  return (
    <div className={`container fade-in ${styles.page}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Skills Network</h1>
        <p className={styles.sub}>
          Technology co-occurrence across{' '}
          <span className={styles.highlight}>{projectCount} production projects</span>.
          Node size reflects frequency of use. Edges connect technologies that
          appear together in the same project.
        </p>
      </div>
      <SkillsNetwork />
    </div>
  )
}
