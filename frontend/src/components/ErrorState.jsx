export default function ErrorState({ error }) {
  const message = error?.message || error?.body?.error || 'Something went wrong';
  return (
    <div className="error-state">
      <p>{message}</p>
    </div>
  );
}
