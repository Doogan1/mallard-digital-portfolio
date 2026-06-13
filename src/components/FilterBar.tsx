import type { SkillCategory } from '../lib/skills'
import {
  SKILL_CATEGORIES,
  SKILL_CATEGORY_ORDER,
  getStackTagsByCategory,
} from '../lib/skills'
import type { Project } from '../lib/types'
import StackTag from './StackTag'
import styles from './FilterBar.module.css'

interface Props {
  projects: Project[]
  activeSkillCategory: SkillCategory | 'all'
  activeTag: string | null
  onSkillCategoryChange: (cat: SkillCategory | 'all') => void
  onTagChange: (tag: string | null) => void
}

export default function FilterBar({
  projects,
  activeSkillCategory,
  activeTag,
  onSkillCategoryChange,
  onTagChange,
}: Props) {
  const tagsByCategory = getStackTagsByCategory(projects)

  return (
    <div className={styles.wrapper}>
      <div className={styles.group}>
        <span className={styles.label}>Category</span>
        <div className={styles.pills}>
          <button
            type="button"
            className={`${styles.pill} ${activeSkillCategory === 'all' ? styles.pillActive : ''}`}
            onClick={() => onSkillCategoryChange('all')}
          >
            All
          </button>
          {SKILL_CATEGORY_ORDER.filter((c) => c !== 'other').map((category) => {
            const { label, color } = SKILL_CATEGORIES[category]
            const hasTags = (tagsByCategory.get(category)?.length ?? 0) > 0
            if (!hasTags) return null
            const isActive = activeSkillCategory === category
            return (
              <button
                key={category}
                type="button"
                className={`${styles.pill} ${isActive ? styles.pillActive : ''}`}
                style={
                  isActive
                    ? { color, borderColor: `${color}80`, background: `${color}18` }
                    : { borderColor: `${color}40` }
                }
                onClick={() => onSkillCategoryChange(category)}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>

      {activeTag && (
        <div className={styles.group}>
          <span className={styles.label}>Active</span>
          <div className={styles.pills}>
            <StackTag tag={activeTag} active filter onClick={() => onTagChange(null)} />
            <button type="button" className={styles.clearBtn} onClick={() => onTagChange(null)}>
              Clear ×
            </button>
          </div>
        </div>
      )}

      {!activeTag && (
        <div className={styles.stackGroups}>
          {SKILL_CATEGORY_ORDER.map((category) => {
            const tags = tagsByCategory.get(category) ?? []
            if (tags.length === 0) return null
            if (activeSkillCategory !== 'all' && activeSkillCategory !== category) return null

            const { label, color } = SKILL_CATEGORIES[category]
            return (
              <div key={category} className={styles.skillGroup}>
                <span className={styles.skillGroupLabel} style={{ color }}>
                  {label}
                </span>
                <div className={styles.skillGroupTags}>
                  {tags.map((tag) => (
                    <StackTag
                      key={tag}
                      tag={tag}
                      filter
                      onClick={() => onTagChange(tag)}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
