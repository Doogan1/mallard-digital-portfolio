import type { ProjectCategory } from '../lib/types'
import styles from './FilterBar.module.css'

const CATEGORIES: { value: ProjectCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'agentic-ai', label: 'Agentic AI' },
  { value: 'data-engineering', label: 'Data Engineering' },
  { value: 'full-stack', label: 'Full Stack' },
  { value: 'platform', label: 'Platform' },
  { value: 'infrastructure', label: 'Infrastructure' },
]

interface Props {
  activeCategory: ProjectCategory | 'all';
  activeTag: string | null;
  allTags: string[];
  onCategoryChange: (cat: ProjectCategory | 'all') => void;
  onTagChange: (tag: string | null) => void;
}

export default function FilterBar({
  activeCategory,
  activeTag,
  allTags,
  onCategoryChange,
  onTagChange,
}: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.group}>
        <span className={styles.label}>Category</span>
        <div className={styles.pills}>
          {CATEGORIES.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              className={`${styles.pill} ${activeCategory === value ? styles.pillActive : ''}`}
              onClick={() => onCategoryChange(value as ProjectCategory | 'all')}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {activeTag && (
        <div className={styles.group}>
          <span className={styles.label}>Stack</span>
          <div className={styles.pills}>
            <button
              type="button"
              className={`tag tag--active`}
              onClick={() => onTagChange(null)}
            >
              {activeTag} ×
            </button>
          </div>
        </div>
      )}

      {!activeTag && allTags.length > 0 && (
        <div className={styles.group}>
          <span className={styles.label}>Stack</span>
          <div className={`${styles.pills} ${styles.tagCloud}`}>
            {allTags.slice(0, 20).map((tag) => (
              <button
                key={tag}
                type="button"
                className="tag tag--filter"
                onClick={() => onTagChange(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
