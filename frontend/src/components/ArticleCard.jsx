import { Link } from 'react-router-dom';

export default function ArticleCard({ article, featured }) {
  const tierLabel = article.tier === 1 ? 'Feature' : article.tier === 2 ? 'Main' : 'Brief';
  return (
    <article className={featured ? 'article-card article-card-featured' : 'article-card'}>
      <span className="tier-badge">{tierLabel}</span>
      <Link
        to={`/article/${article.id}`}
        className={`article-headline ${featured ? 'article-headline-featured' : ''}`}
      >
        {article.headline}
      </Link>
      {article.body && (
        <p className="article-excerpt">
          {article.body.slice(0, 140).replace(/\n/g, ' ')}
          {article.body.length > 140 ? '…' : ''}
        </p>
      )}
    </article>
  );
}
