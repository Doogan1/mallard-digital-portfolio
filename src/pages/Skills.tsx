import SkillsNetwork from '../components/SkillsNetwork'
import styles from './Skills.module.css'

export default function Skills() {
  return (
    <div className={`container fade-in ${styles.page}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Skills Network</h1>
        <p className={styles.sub}>
          Technology co-occurrence across {' '}
          <span className={styles.highlight}>8 production projects</span>.
          Node size reflects frequency of use. Edges connect technologies that
          appear together in the same project.
        </p>
      </div>
      <SkillsNetwork />
    </div>
  )
}
