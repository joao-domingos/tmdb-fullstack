import { TextField } from '@mui/material';
import { useMovie } from '../contexts/MovieContext';

function SearchBar() {
  const { dispatch } = useMovie();

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      dispatch({ type: 'SET_FILTERS', payload: { query: e.target.value } });
    }
  };

  return (
    <TextField
      label="Search Movies"
      placeholder="Type a movie name and press Enter"
      onKeyDown={handleSearch}
      fullWidth
      sx={{
        mb: 2,
        '& .MuiInputBase-input': {
          backgroundColor: '#ffffff',
          color: '#000000',
        },
        '& .MuiInputLabel-root': {
          color: '#000000',
        },
      }}
    />
  );
}

export default SearchBar;