import { useState, useEffect } from 'react';
import { Box, TextField, MenuItem, Button } from '@mui/material';
import { useMovie } from '../context/MovieContext';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

const sortOptions = [
  { value: 'popularity.desc', label: 'Popularity' },
  { value: 'vote_average.desc', label: 'Rating (High to Low)' },
  { value: 'vote_average.asc', label: 'Rating (Low to High)' },
  { value: 'release_date.desc', label: 'Release Date (Newest)' },
  { value: 'release_date.asc', label: 'Release Date (Oldest)' },
];

function FilterSection() {
  const { dispatch } = useMovie();
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [year, setYear] = useState('');
  const [minRating, setMinRating] = useState('');
  const [sortBy, setSortBy] = useState('popularity.desc');

  useEffect(() => {
    fetch(`${BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`)
      .then(res => res.json())
      .then(data => setGenres(data.genres || []))
      .catch(() => setGenres([]));
  }, []);

  const handleApply = () => {
    dispatch({
      type: 'SET_FILTERS',
      payload: {
        genre: selectedGenre || null,
        year: year ? parseInt(year) : null,
        rating: minRating ? parseFloat(minRating) : null,
        sortBy,
      },
    });
  };

  const handleReset = () => {
    setSelectedGenre('');
    setYear('');
    setMinRating('');
    setSortBy('popularity.desc');
    dispatch({
      type: 'SET_FILTERS',
      payload: { genre: null, year: null, rating: null, sortBy: 'popularity.desc' },
    });
  };

  return (
    <Box sx={{ mb: 3, p: 2, backgroundColor: '#3c3836', borderRadius: 1 }}>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          select
          label="Genre"
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          sx={{
            minWidth: 150,
            '& .MuiInputBase-input': { backgroundColor: '#ffffff', color: '#000000' },
            '& .MuiInputLabel-root': { color: '#000000' },
          }}
        >
          {genres.map((genre) => (
            <MenuItem key={genre.id} value={genre.id}>
              {genre.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Year"
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          inputProps={{ min: 1900, max: 2030 }}
          sx={{
            width: 120,
            '& .MuiInputBase-input': { backgroundColor: '#ffffff', color: '#000000' },
            '& .MuiInputLabel-root': { color: '#000000' },
          }}
        />

        <TextField
          label="Min Rating"
          type="number"
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
          inputProps={{ min: 0, max: 10, step: 0.1 }}
          sx={{
            width: 120,
            '& .MuiInputBase-input': { backgroundColor: '#ffffff', color: '#000000' },
            '& .MuiInputLabel-root': { color: '#000000' },
          }}
        />

        <TextField
          select
          label="Sort By"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          sx={{
            minWidth: 180,
            '& .MuiInputBase-input': { backgroundColor: '#ffffff', color: '#000000' },
            '& .MuiInputLabel-root': { color: '#000000' },
          }}
        >
          {sortOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <Button
          variant="contained"
          onClick={handleApply}
          sx={{ backgroundColor: '#fabd2f', color: '#000000', '&:hover': { backgroundColor: '#d4a017' } }}
        >
          Apply
        </Button>

        <Button
          variant="outlined"
          onClick={handleReset}
          sx={{ borderColor: '#fabd2f', color: '#fabd2f' }}
        >
          Reset
        </Button>
      </Box>
    </Box>
  );
}

export default FilterSection;
