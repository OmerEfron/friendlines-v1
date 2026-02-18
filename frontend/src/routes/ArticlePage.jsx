import { useParams, Link } from 'react-router-dom';
import { useArticle } from '../hooks/useArticle';
import Header from '../components/Header';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';

function ArticlePage() {
  const { id } = useParams();
  const { data, loading, error } = useArticle(id);

  if (loading) {
    return (
      <>
        <Header />
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
  if (!data) {
    return (
      <>
        <Header />
        <main className="main-content">
          <ErrorState error={{ message: 'Article not found' }} />
        </main>
      </>
    );
  }

  const paragraphs = (data.body || '').split(/\n\n+/).filter(Boolean);
  const editionDate = data.date;
  const dateLabel = editionDate
    ? new Date(editionDate).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  const tierLabel =
    data.tier === 1 ? 'Feature' : data.tier === 2 ? 'Main' : 'Brief';
  const leadParagraph = paragraphs[0];
  const bodyParagraphs = paragraphs.slice(1);

  return (
    <>
      <Header subtitle={dateLabel} dateLabel={dateLabel} />
      <main className="main-content article-page">
        {editionDate && (
          <p>
            <Link to={`/?date=${editionDate}`} className="back-link">
              ← Back to edition
            </Link>
          </p>
        )}
        <article>
          <span className="tier-badge">{tierLabel}</span>
          <h1 className="article-page-headline">{data.headline}</h1>
          {leadParagraph && (
            <p className="article-page-subheadline">{leadParagraph}</p>
          )}
          {bodyParagraphs.length > 0 && (
            <div className="article-body">
              {bodyParagraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          )}
        </article>
      </main>
    </>
  );
}

export default ArticlePage;
