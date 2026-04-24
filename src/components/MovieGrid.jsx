import { Grid, Typography, CircularProgress } from '@mui/material';
import MovieCard from './MovieCard';
import { useMovie } from '../context/MovieContext';
import { useEffect } from 'react';

function MovieGrid() {
  const { state, dispatch, fetchMovies } = useMovie();
  const { movies, genres, loading, error, filters, page } = state;

  useEffect(() => {
    fetchMovies(dispatch, filters, page);
  }, [filters, page]);

  if (loading) {
    return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 4 }} />;
  }

  if (error) {
    return <Typography color="error" align="center">{error}</Typography>;
  }

  if (!movies || movies.length === 0) {
    return <Typography align="center">No movies found. Try a different search.</Typography>;
  }

  return (
    <Grid container spacing={3}>
      {movies.map((movie) => (
        <Grid item key={movie.id} xs={12} sm={6} md={4} lg={3}>
          <MovieCard movie={movie} genresList={genres} />
        </Grid>
      ))}
    </Grid>
  );
}

export default MovieGrid;