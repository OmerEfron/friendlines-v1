import { Link } from 'react-router-dom';
import { useEditionsList } from '../hooks/useEditionsList';
import Header from '../components/Header';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';

const archiveListStyles = {
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  item: {
    padding: '0.5rem 0',
    borderBottom: '1px solid var(--color-border)',
  },
  link: {
    color: 'var(--color-ink)',
    textDecoration: 'none',
    display: 'block',
  },
  date: {
    fontWeight: 500,
  },
  meta: {
    display: 'block',
    fontSize: '0.85rem',
    color: 'var(--color-ink-muted)',
    marginTop: '0.25rem',
  },
};

function ArchivePage() {
  const { data, loading, error } = useEditionsList();

  if (loading) {
    return (
      <>
        <Header dateLabel="Archive" subtitle="Archive" />
        <main className="main-content">
          <Loading />
        </main>
      </>
    );
  }
  if (error) {
    return (
      <>
        <Header />
        <main className="main-content">
          <ErrorState error={error} />
        </main>
      </>
    );
  }

  const editions = data || [];

  return (
    <>
      <Header dateLabel="Archive" subtitle="Archive" />
      <main className="main-content">
        <h1 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
          Past Editions
        </h1>
        {editions.length === 0 ? (
          <p className="empty-state">No editions yet.</p>
        ) : (
          <ul style={archiveListStyles.list}>
            {editions.map((ed) => (
              <li key={ed.id} style={archiveListStyles.item}>
                <Link
                  to={`/?date=${ed.date}`}
                  style={archiveListStyles.link}
                  data-testid="edition-link"
                >
                  <span style={archiveListStyles.date}>
                    {new Date(ed.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  {ed.articleCount != null && (
                    <span style={archiveListStyles.meta}>
                      {ed.articleCount} article
                      {ed.articleCount !== 1 ? 's' : ''}
                      {ed.topStoryHeadline &&
                        ` · ${ed.topStoryHeadline.slice(0, 50)}${
                          ed.topStoryHeadline.length > 50 ? '…' : ''
                        }`}
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

export default ArchivePage;
