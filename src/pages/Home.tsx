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
              <p className={styles.heroEyebrow}>Applied AI Engineer</p>
              <h1 className={styles.heroName}>Drake Olejniczak</h1>
              <p className={styles.heroTagline}>
                I ship production LLM and agentic systems — tool use, RAG-style retrieval,
                vision pipelines — on real data with the full-stack discipline to deploy, secure,
                and hand off. Spec-driven workflow; AI-assisted implementation; human review
                on everything that merges.
              </p>
              <div className={styles.heroLinks}>
                <Link to="/skills" className={`${styles.heroLink} ${styles.heroLinkPrimary}`}>
                  Skills network →
                </Link>
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
                  className={styles.heroLink}
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
            <div>
              <h2 className={styles.sectionTitle}>Featured Work</h2>
              <p className={styles.sectionSubInline}>
                Agentic assistants, county chatbots, and production platforms where AI meets
                compliance and real users.
              </p>
            </div>
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
            Derived from {projects.length} production projects — weighted toward the data,
            cloud, and application layers that support applied AI in government and civic
            contexts.{' '}
            <Link to="/skills" className={styles.inlineLink}>
              Explore the co-occurrence graph →
            </Link>
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
                Ph.D. in mathematics (graph theory, Western Michigan University). I work as
                an applied AI engineer in practice: designing agent loops, retrieval and tool
                interfaces, and the surrounding APIs, data stores, and deploy pipelines so
                models actually reach users — not demo slides.
              </p>
              <p>
                Representative work includes <strong>ZIP</strong> (Claude tool use over zoning
                ordinances and PostGIS parcels), <strong>Marty AI</strong> (production county
                chatbots plus a custom Anthropic agent for Find-a-Ride), and{' '}
                <strong>County Alt Text</strong> (Claude Vision + Batch API for WCAG alt text
                at scale). I also own full platforms where AI is one layer among many — e.g. the
                CDBG digital intake system — because shipping in regulated environments means
                auth, encryption, and CI matter as much as the prompt.
              </p>
              <p>
                I&apos;m a Digital Solutions Specialist at Van Buren County&apos;s Digital
                Information Department under{' '}
                <strong>DICE (Digital Innovation Collaborative Exchange)</strong>, building
                for Van Buren and St. Joseph Counties and partners such as Market One and the
                Southwest Michigan Planning Commission. I co-founded{' '}
                <strong>MI-GAIN</strong> (Michigan Government AI Network), a statewide peer
                network for public-sector AI practitioners.
              </p>

              <h3 className={styles.aboutHeading}>How I work</h3>
              <p>
                I use AI-assisted development deliberately — not as a shortcut around
                engineering judgment, but to move faster while keeping work auditable and
                maintainable. The goal is production code a teammate can read, deploy, and
                extend.
              </p>
              <ul className={styles.aboutList}>
                <li>
                  <strong>Linear first</strong> — issues carry scope and acceptance criteria
                  before implementation; descriptions stay the spec, comments carry status.
                </li>
                <li>
                  <strong>AI as implementation leverage</strong> — Cursor and Claude Code for
                  drafts, refactors, and API exploration; I review for data models, security,
                  and operational fit before merge.
                </li>
                <li>
                  <strong>Small, traceable changes</strong> — PRs tied to tickets; staging
                  environments where stakes are high (e.g. CDBG auto-deploy to staging, manual
                  production promotion).
                </li>
                <li>
                  <strong>Auditable artifacts</strong> — Sqitch migrations, GitHub Actions and
                  Cloud Build, deploy manifests (such as{' '}
                  <code className={styles.aboutCode}>.version.json</code> on WordPress
                  releases), conversation logging pipelines for chatbots.
                </li>
                <li>
                  <strong>Human gates on risk</strong> — PII, KMS, Firestore rules, and
                  production promotion stay explicit decisions, not model defaults.
                </li>
              </ul>
              <p>
                This portfolio is built the same way: project content in git,{' '}
                <Link to="/skills" className={styles.inlineLink}>
                  skills network
                </Link>{' '}
                regenerated on every push via GitHub Actions. The process and the product are
                aligned.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
