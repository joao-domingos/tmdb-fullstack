import { useState } from 'react';
import { Box, TextField, MenuItem, Button } from '@mui/material';
import { useMovie } from '../contexts/MovieContext';

const sortOptions = [
  { value: 'popularity.desc', label: 'Popularity' },
  { value: 'vote_average.desc', label: 'Rating (High to Low)' },
  { value: 'vote_average.asc', label: 'Rating (Low to High)' },
  { value: 'release_date.desc', label: 'Release Date (Newest)' },
  { value: 'release_date.asc', label: 'Release Date (Oldest)' },
];

function FilterSection() {
  const { state, dispatch } = useMovie();
  const { genres } = state;
  const [selectedGenre, setSelectedGenre] = useState('');
  const [year, setYear] = useState('');
  const [minRating, setMinRating] = useState('');
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [yearError, setYearError] = useState('');
  const [ratingError, setRatingError] = useState('');

  const validateInputs = () => {
    let isValid = true;

    if (year) {
      const yearNum = parseInt(year);
      if (yearNum < 1887 || yearNum > 2116) {
        setYearError('Year must be between 1887 and 2116');
        isValid = false;
      } else {
        setYearError('');
      }
    } else {
      setYearError('');
    }

    if (minRating) {
      const ratingNum = parseFloat(minRating);
      if (ratingNum < 0 || ratingNum > 10) {
        setRatingError('Rating must be between 0 and 10');
        isValid = false;
      } else {
        setRatingError('');
      }
    } else {
      setRatingError('');
    }

    return isValid;
  };

  const handleApply = () => {
    if (!validateInputs()) {
      return;
    }

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
    setYearError('');
    setRatingError('');
    dispatch({
      type: 'SET_FILTERS',
      payload: { genre: null, year: null, rating: null, sortBy: 'popularity.desc' },
    });
  };

  const handleYearChange = (e) => {
    setYear(e.target.value);
    if (yearError) setYearError('');
  };

  const handleRatingChange = (e) => {
    setMinRating(e.target.value);
    if (ratingError) setRatingError('');
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
          onChange={handleYearChange}
          error={yearError !== ''}
          helperText={yearError}
          inputProps={{ min: 1887, max: 2116 }}
          sx={{
            width: 140,
            '& .MuiInputBase-input': { backgroundColor: '#ffffff', color: '#000000' },
            '& .MuiInputLabel-root': { color: '#000000' },
          }}
        />

        <TextField
          label="Min Rating"
          type="number"
          value={minRating}
          onChange={handleRatingChange}
          error={ratingError !== ''}
          helperText={ratingError}
          inputProps={{ min: 0, max: 10, step: 0.1 }}
          sx={{
            width: 140,
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
          disabled={yearError !== '' || ratingError !== ''}
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