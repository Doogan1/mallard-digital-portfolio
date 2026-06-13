import { Link, useNavigate } from 'react-router-dom'
import { loadProjects } from '../lib/parseProjects'
import { getStackTagsByCategory, SKILL_CATEGORIES, SKILL_CATEGORY_ORDER } from '../lib/skills'
import ProjectCard from '../components/ProjectCard'
import StackTag from '../components/StackTag'
import styles from './Home.module.css'

const GITHUB_URL = 'https://github.com/Doogan1'
const LINKEDIN_URL = 'https://linkedin.com/in/drake-olejniczak'

export default function Home() {
  const navigate = useNavigate()
  const projects = loadProjects()
  const featured = projects.filter((p) => p.featured)
  const tagsByCategory = getStackTagsByCategory(projects)

  return (
    <div className="fade-in">
      {/* Hero */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroInner}>
            <div className={styles.heroText}>
              <p className={styles.heroEyebrow}>AI &amp; Data Engineer</p>
              <h1 className={styles.heroName}>Drake Olejniczak</h1>
              <p className={styles.heroTagline}>
                Building production AI systems, data pipelines, and full-stack platforms —
                working directly with stakeholders to turn complex problems into working software.
              </p>
              <div className={styles.heroLinks}>
                <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className={styles.heroLink}>
                  GitHub ↗
                </a>
                <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className={styles.heroLink}>
                  LinkedIn ↗
                </a>
                <a
                  href="/drake-olejniczak/Drake-Olejniczak-Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.heroLink} ${styles.heroLinkPrimary}`}
                >
                  Resume PDF ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured projects */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Featured Projects</h2>
            <Link to="/projects" className={styles.seeAll}>
              All projects →
            </Link>
          </div>
          <div className={styles.grid}>
            {featured.map((p) => (
              <ProjectCard
                key={p.slug}
                project={p}
                onTagClick={(tag) => navigate(`/projects?tag=${encodeURIComponent(tag)}`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Skills summary */}
      <section className={styles.section}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Technology Stack</h2>
          <p className={styles.sectionSub}>
            Derived from {projects.length} production projects across AI, data, and full-stack engineering.
          </p>
          <div className={styles.stackGroups}>
            {SKILL_CATEGORY_ORDER.map((category) => {
              const tags = tagsByCategory.get(category) ?? []
              if (tags.length === 0) return null
              const { label, color } = SKILL_CATEGORIES[category]
              return (
                <div key={category} className={styles.skillGroup}>
                  <span className={styles.skillGroupLabel} style={{ color }}>
                    {label}
                  </span>
                  <div className={styles.tagCloud}>
                    {tags.map((tag) => (
                      <StackTag
                        key={tag}
                        tag={tag}
                        filter
                        onClick={() => navigate(`/projects?tag=${encodeURIComponent(tag)}`)}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* About */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.about}>
            <h2 className={styles.sectionTitle}>About</h2>
            <div className={styles.aboutBody}>
            <p>
              Ph.D. in mathematics (graph theory, Western Michigan University) turned
              production AI and data engineer. I build end-to-end — agentic AI systems,
              data pipelines, full-stack platforms — and work directly with the
              stakeholders who will use what I ship. The problems I solve are real and
              immediate: a planning office fielding the same zoning questions all day, a
              grant administrator processing paper applications across ten municipalities,
              three legacy government websites that needed to be off Classic ASP by March 31st.
            </p>
            <p>
              I'm a Digital Solutions Specialist at Van Buren County's 
              Digital Information Department, operating under <strong>DICE (Digital Innovation
              Collaborative Exchange)</strong> — an intergovernmental agreement serving
              Van Buren County, St. Joseph County, and regional partners including Market
              One and the Southwest Michigan Planning Commission. In practice that means
              I build production software for multiple government clients from a single
              team, with the infrastructure decisions and deployment patterns I establish
              becoming the standard across all of them.
            </p>
            <p>
              I co-founded <strong>MI-GAIN</strong> (Michigan Government AI Network), a
              statewide peer network for government AI practitioners, and stay engaged in
              the broader question of how public institutions can responsibly adopt AI —
              not as a philosophical exercise, but as someone actively building those systems.
            </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
