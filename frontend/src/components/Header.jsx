import { Link, useLocation } from 'react-router-dom';

export default function Header({ subtitle, dateLabel }) {
  const location = useLocation();
  const isHome = location.pathname === '/' || location.pathname === '';
  const isArchive = location.pathname === '/archive';

  const stripDate =
    dateLabel ?? (isHome ? 'Today' : isArchive ? 'Archive' : 'FriendLines');

  return (
    <>
      {stripDate && (
        <div className="top-strip">
          <div className="top-strip-inner">
            <span>FriendLines</span>
            <span>{stripDate}</span>
          </div>
        </div>
      )}
      <header className="site-header">
        <div className="site-header-inner">
          <Link to="/" className="brand">
            FriendLines
          </Link>
          {subtitle && <span className="header-subtitle">{subtitle}</span>}
          <nav className="header-nav">
            <Link
              to="/"
              className={`nav-link ${isHome ? 'nav-link-active' : ''}`}
            >
              Today
            </Link>
            <Link
              to="/archive"
              className={`nav-link ${isArchive ? 'nav-link-active' : ''}`}
            >
              Archive
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
