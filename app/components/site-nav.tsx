import Link from "next/link";
import styles from "./site-nav.module.css";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about-me", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/blogs", label: "Blog" },
  { href: "/admin/blogs", label: "Blog admin" },
  { href: "/contact-me-server-form", label: "Contact" },
  { href: "/contact-me", label: "Contact (API)" },
];

export default function SiteNav() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label="Main navigation">
        <Link href="/" className={styles.brand}>
          Lanboer Zhao
        </Link>
        <ul className={styles.links}>
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className={styles.link}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
