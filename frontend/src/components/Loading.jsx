export default function Loading() {
  return (
    <div style={styles.wrapper}>
      <span style={styles.text}>Loading…</span>
    </div>
  );
}

const styles = {
  wrapper: {
    padding: '3rem',
    textAlign: 'center',
    color: '#666',
  },
  text: {
    fontFamily: 'Georgia, serif',
  },
};
