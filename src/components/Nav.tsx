import { NavLink } from 'react-router-dom'
import styles from './Nav.module.css'

export default function Nav() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <NavLink to="/" className={styles.brand}>
          <span className={styles.brandName}>Drake Olejniczak</span>
          <span className={styles.brandRole}>AI &amp; Data Engineer</span>
        </NavLink>
        <nav className={styles.nav}>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.linkActive}` : styles.link
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/projects"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.linkActive}` : styles.link
            }
          >
            Projects
          </NavLink>
          <NavLink
            to="/skills"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.linkActive}` : styles.link
            }
          >
            Skills
          </NavLink>
          <a
            href="/drake-olejniczak/Drake-Olejniczak-Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.resumeLink}
          >
            Resume ↗
          </a>
        </nav>
      </div>
    </header>
  )
}
