import { useSearchParams } from 'react-router-dom';
import { useEdition } from '../hooks/useEdition';
import Header from '../components/Header';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';
import ArticleCard from '../components/ArticleCard';

function HomePage() {
  const [searchParams] = useSearchParams();
  const dateParam = searchParams.get('date');
  const { data, loading, error } = useEdition(dateParam);

  if (loading) return <><Header subtitle="Today" /><Loading /></>;
  if (error) return <><Header /><ErrorState error={error} /></>;

  const dateLabel = data?.date ? new Date(data.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) : 'Today';
  const articleCount = (data?.topStory ? 1 : 0) + (data?.briefs?.length || 0);

  return (
    <>
      <Header subtitle={dateLabel} />
      <main style={styles.main}>
        {articleCount > 0 && (
          <p style={styles.meta}>{articleCount} article{articleCount !== 1 ? 's' : ''}</p>
        )}
        {data?.topStory ? (
          <ArticleCard article={data.topStory} featured />
        ) : (
          <p style={styles.empty}>
            No top story yet. Share updates via Telegram to build your edition.
          </p>
        )}
        <section style={styles.briefs}>
          <h2 style={styles.sectionTitle}>Briefs</h2>
          {(data?.briefs || []).length > 0 ? (
            data.briefs.map((a) => <ArticleCard key={a.id} article={a} />)
          ) : (
            <p style={styles.empty}>No briefs in this edition.</p>
          )}
        </section>
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
  meta: {
    fontSize: '0.85rem',
    color: '#666',
    marginBottom: '1rem',
  },
  briefs: {
    marginTop: '2rem',
  },
  sectionTitle: {
    fontSize: '0.85rem',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '1rem',
  },
  empty: {
    color: '#888',
    fontStyle: 'italic',
  },
};

export default HomePage;
