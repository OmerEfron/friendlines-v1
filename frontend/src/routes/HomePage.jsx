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

  if (loading) {
    return (
      <>
        <Header dateLabel="Today" subtitle="Today" />
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

  const dateLabel = data?.date
    ? new Date(data.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Today';
  const articleCount = (data?.topStory ? 1 : 0) + (data?.briefs?.length || 0);

  return (
    <>
      <Header subtitle={dateLabel} dateLabel={dateLabel} />
      <main className="main-content">
        {articleCount > 0 && (
          <p className="edition-meta">
            {articleCount} article{articleCount !== 1 ? 's' : ''}
          </p>
        )}
        {data?.topStory ? (
          <ArticleCard article={data.topStory} featured />
        ) : (
          <p className="empty-state">
            No top story yet. Share updates via Telegram to build your edition.
          </p>
        )}
        <section className="briefs-section">
          <h2 className="section-title">Briefs</h2>
          {(data?.briefs || []).length > 0 ? (
            data.briefs.map((a) => <ArticleCard key={a.id} article={a} />)
          ) : (
            <p className="empty-state">No briefs in this edition.</p>
          )}
        </section>
      </main>
    </>
  );
}

export default HomePage;
