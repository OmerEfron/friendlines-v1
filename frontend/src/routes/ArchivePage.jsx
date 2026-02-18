import { Link } from 'react-router-dom';
import { useEditionsList } from '../hooks/useEditionsList';
import Header from '../components/Header';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';

function ArchivePage() {
  const { data, loading, error } = useEditionsList();

  if (loading) return <><Header subtitle="Archive" /><Loading /></>;
  if (error) return <><Header /><ErrorState error={error} /></>;

  return (
    <>
      <Header subtitle="Archive" />
      <main style={styles.main}>
        <h1 style={styles.title}>Past Editions</h1>
        {(data || []).length === 0 ? (
          <p style={styles.empty}>No editions yet.</p>
        ) : (
          <ul style={styles.list}>
            {(data || []).map((ed) => (
              <li key={ed.id} style={styles.item}>
                <Link to={`/?date=${ed.date}`} style={styles.link} data-testid="edition-link">
                  <span style={styles.date}>
                    {new Date(ed.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  {ed.articleCount != null && (
                    <span style={styles.meta}>
                      {ed.articleCount} article{ed.articleCount !== 1 ? 's' : ''}
                      {ed.topStoryHeadline && ` · ${ed.topStoryHeadline.slice(0, 50)}${ed.topStoryHeadline.length > 50 ? '…' : ''}`}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}

const styles = {
  main: {
    maxWidth: '700px',
    margin: '0 auto',
    padding: '1.5rem',
    fontFamily: 'Georgia, serif',
  },
  title: {
    fontSize: '1.25rem',
    marginBottom: '1rem',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  item: {
    padding: '0.5rem 0',
    borderBottom: '1px solid #eee',
  },
  link: {
    color: '#333',
    textDecoration: 'none',
    display: 'block',
  },
  date: {
    fontWeight: 500,
  },
  meta: {
    display: 'block',
    fontSize: '0.85rem',
    color: '#666',
    marginTop: '0.25rem',
  },
  empty: {
    color: '#888',
    fontStyle: 'italic',
  },
};

export default ArchivePage;
