import { MovieProvider } from './context/MovieContext';
import SearchBar from './components/SearchBar';
import MovieGrid from './components/MovieGrid';

function App() {
  return (
    <MovieProvider>
      <SearchBar />
      <MovieGrid />
    </MovieProvider>
  );
}

export default App;