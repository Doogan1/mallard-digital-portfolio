import { getSkillCategory, getTagStyles } from '../lib/skills'

interface Props {
  tag: string
  active?: boolean
  filter?: boolean
  onClick?: () => void
}

export default function StackTag({ tag, active = false, filter = false, onClick }: Props) {
  const category = getSkillCategory(tag)
  const styles = getTagStyles(category, active)
  const className = ['tag', filter ? 'tag--filter' : '', active ? 'tag--active' : '']
    .filter(Boolean)
    .join(' ')

  if (filter || onClick) {
    return (
      <button type="button" className={className} style={styles} onClick={onClick}>
        {tag}
      </button>
    )
  }

  return (
    <span className={className} style={styles}>
      {tag}
    </span>
  )
}
