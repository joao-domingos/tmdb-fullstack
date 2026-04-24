import MovieGrid from './components/MovieGrid';

const mockMovies = [
  { id: 1, title: 'Dead Poets Society', vote_average: 8.4 },
  { id: 2, title: 'The Shawshank Redemption', vote_average: 9.3 },
  { id: 3, title: 'Pulp Fiction', vote_average: 8.5 },
  { id: 4, title: 'The Godfather', vote_average: 8.7 },
];

function App() {
  return <MovieGrid movies={mockMovies} />;
}

export default App;