import { Routes, Route } from 'react-router-dom';
import HomePage from './routes/HomePage';
import ArchivePage from './routes/ArchivePage';
import ArticlePage from './routes/ArticlePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/archive" element={<ArchivePage />} />
      <Route path="/article/:id" element={<ArticlePage />} />
    </Routes>
  );
}

export default App;
