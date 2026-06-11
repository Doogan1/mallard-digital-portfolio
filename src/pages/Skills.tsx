import styles from './Skills.module.css'

export default function Skills() {
  return (
    <div className={`container fade-in ${styles.page}`}>
      <h1 className={styles.title}>Skills Network</h1>
      <p className={styles.sub}>Coming in v2</p>
      <div className={styles.placeholder}>
        <div className={styles.placeholderIcon}>⬡</div>
        <p className={styles.placeholderText}>
          A D3 force-directed graph showing technology co-occurrence across all portfolio projects.
          Each technology is a node; edges connect technologies that appear together in the same project.
          Node size reflects frequency across projects.
        </p>
        <p className={styles.placeholderNote}>Planned for v2.</p>
      </div>
    </div>
  )
}
