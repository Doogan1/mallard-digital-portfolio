import { SKILL_CATEGORIES, type SkillCategory } from '../lib/skills'

interface Props {
  category: SkillCategory
}

export default function SkillCategoryBadge({ category }: Props) {
  const { label, color, rgb } = SKILL_CATEGORIES[category]

  return (
    <span
      className="skill-cat-tag"
      style={{
        color,
        background: `rgba(${rgb}, 0.12)`,
        borderColor: `rgba(${rgb}, 0.28)`,
      }}
    >
      {label}
    </span>
  )
}
