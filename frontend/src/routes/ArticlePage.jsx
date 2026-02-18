import { useParams, Link } from 'react-router-dom';
import { useArticle } from '../hooks/useArticle';
import Header from '../components/Header';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';

function ArticlePage() {
  const { id } = useParams();
  const { data, loading, error } = useArticle(id);

  if (loading) return <><Header /><Loading /></>;
  if (error) return <><Header /><ErrorState error={error} /></>;
  if (!data) return <><Header /><ErrorState error={{ message: 'Article not found' }} /></>;

  const paragraphs = (data.body || '').split(/\n\n+/).filter(Boolean);

  return (
    <>
      <Header subtitle={data.date ? new Date(data.date).toLocaleDateString() : ''} />
      <main style={styles.main}>
        <article>
          <span style={styles.tier}>
            {data.tier === 1 ? 'Feature' : data.tier === 2 ? 'Main' : 'Brief'}
          </span>
          <h1 style={styles.headline}>{data.headline}</h1>
          <div style={styles.body}>
            {paragraphs.map((p, i) => (
              <p key={i} style={styles.para}>{p}</p>
            ))}
          </div>
          {data.related_thread_id && (
            <p style={styles.related}>
              <Link to="/archive" style={styles.link}>View related thread in archive</Link>
            </p>
          )}
        </article>
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
  tier: {
    fontSize: '0.75rem',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  headline: {
    fontSize: '1.75rem',
    marginTop: '0.25rem',
    marginBottom: '0.5rem',
    lineHeight: 1.2,
  },
  body: {
    lineHeight: 1.7,
  },
  para: {
    marginBottom: '1rem',
  },
  related: {
    marginTop: '2rem',
    fontSize: '0.9rem',
    color: '#666',
  },
  link: {
    color: '#333',
    textDecoration: 'underline',
  },
};

export default ArticlePage;
