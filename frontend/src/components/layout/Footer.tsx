import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <span className={styles.copy}>© {new Date().getFullYear()} Aether AI — Atmospheric Intelligence</span>
      <div className={styles.links}>
        <span className={styles.link}>Privacy</span>
        <span className={styles.link}>Terms</span>
        <span className={styles.link}>Contact</span>
      </div>
    </footer>
  )
}
