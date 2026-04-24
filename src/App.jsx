import { MovieProvider } from './context/MovieContext';
import SearchBar from './components/SearchBar';
import FilterSection from './components/FilterSection';
import MovieGrid from './components/MovieGrid';

function App() {
  return (
    <MovieProvider>
      <SearchBar />
      <FilterSection />
      <MovieGrid />
    </MovieProvider>
  );
}

export default App;