export default function ErrorState({ error }) {
  const message = error?.message || error?.body?.error || 'Something went wrong';
  return (
    <div style={styles.wrapper}>
      <p style={styles.text}>{message}</p>
    </div>
  );
}

const styles = {
  wrapper: {
    padding: '2rem',
    textAlign: 'center',
    color: '#c00',
  },
  text: {
    fontFamily: 'Georgia, serif',
  },
};
