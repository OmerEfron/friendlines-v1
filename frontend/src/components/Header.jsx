import { Link, useLocation } from 'react-router-dom';

export default function Header({ subtitle }) {
  const location = useLocation();
  const isHome = location.pathname === '/' || location.pathname === '';
  const isArchive = location.pathname === '/archive';

  return (
    <header style={styles.header}>
      <Link to="/" style={styles.brand}>
        FriendLines
      </Link>
      {subtitle && <span style={styles.subtitle}>{subtitle}</span>}
      <nav style={styles.nav}>
        <Link
          to="/"
          style={{
            ...styles.link,
            ...(isHome ? styles.linkActive : {}),
          }}
        >
          Today
        </Link>
        <Link
          to="/archive"
          style={{
            ...styles.link,
            ...(isArchive ? styles.linkActive : {}),
          }}
        >
          Archive
        </Link>
      </nav>
    </header>
  );
}

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem 1.5rem',
    borderBottom: '1px solid #e0e0e0',
    fontFamily: 'Georgia, serif',
  },
  brand: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#111',
    textDecoration: 'none',
  },
  subtitle: {
    color: '#666',
    fontSize: '0.9rem',
    marginLeft: '0.5rem',
  },
  nav: {
    marginLeft: 'auto',
    display: 'flex',
    gap: '1rem',
  },
  link: {
    color: '#333',
    textDecoration: 'none',
    fontSize: '0.95rem',
  },
  linkActive: {
    fontWeight: 600,
    borderBottom: '1px solid #333',
  },
};
