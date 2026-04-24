import { MovieProvider } from './context/MovieContext';
import SearchBar from './components/SearchBar';
import FilterSection from './components/FilterSection';
import MovieGrid from './components/MovieGrid';
import Pagination from './components/Pagination';

function App() {
  return (
    <MovieProvider>
      <SearchBar />
      <FilterSection />
      <Pagination />
      <MovieGrid />
    </MovieProvider>
  );
}

export default App;
