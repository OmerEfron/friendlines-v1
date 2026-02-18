import { Link } from 'react-router-dom';

export default function ArticleCard({ article, featured }) {
  const tierLabel = article.tier === 1 ? 'Feature' : article.tier === 2 ? 'Main' : 'Brief';
  return (
    <article style={featured ? styles.featured : styles.card}>
      <span style={styles.tier}>{tierLabel}</span>
      <Link to={`/article/${article.id}`} style={styles.headline}>
        {article.headline}
      </Link>
      {article.body && (
        <p style={styles.excerpt}>
          {article.body.slice(0, 120).replace(/\n/g, ' ')}
          {article.body.length > 120 ? '…' : ''}
        </p>
      )}
    </article>
  );
}

const styles = {
  card: {
    padding: '1rem 0',
    borderBottom: '1px solid #eee',
  },
  featured: {
    padding: '1.5rem 0',
    borderBottom: '2px solid #333',
  },
  tier: {
    fontSize: '0.75rem',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  headline: {
    display: 'block',
    marginTop: '0.25rem',
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#111',
    textDecoration: 'none',
    fontFamily: 'Georgia, serif',
  },
  excerpt: {
    marginTop: '0.5rem',
    fontSize: '0.9rem',
    color: '#444',
    lineHeight: 1.5,
  },
};
