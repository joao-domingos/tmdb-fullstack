import { Box, Button, Typography } from '@mui/material';
import { useMovie } from '../context/MovieContext';

function Pagination() {
  const { state, dispatch } = useMovie();
  const { page, totalPages } = state;

  const handlePrev = () => {
    if (page > 1) {
      dispatch({ type: 'SET_PAGE', payload: page - 1 });
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      dispatch({ type: 'SET_PAGE', payload: page + 1 });
    }
  };

  const handlePageClick = (pageNum) => {
    dispatch({ type: 'SET_PAGE', payload: pageNum });
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mt: 4, mb: 4 }}>
      <Button
        variant="outlined"
        onClick={handlePrev}
        disabled={page === 1}
        sx={{ borderColor: '#fabd2f', color: '#fabd2f' }}
      >
        Prev
      </Button>

      {getPageNumbers().map((pageNum) => (
        <Button
          key={pageNum}
          variant={pageNum === page ? 'contained' : 'outlined'}
          onClick={() => handlePageClick(pageNum)}
          sx={{
            borderColor: '#fabd2f',
            color: pageNum === page ? '#000000' : '#fabd2f',
            backgroundColor: pageNum === page ? '#fabd2f' : 'transparent',
            minWidth: 40,
            '&:hover': {
              backgroundColor: pageNum === page ? '#d4a017' : 'rgba(250,189,47,0.1)',
            },
          }}
        >
          {pageNum}
        </Button>
      ))}

      <Button
        variant="outlined"
        onClick={handleNext}
        disabled={page === totalPages || totalPages === 0}
        sx={{ borderColor: '#fabd2f', color: '#fabd2f' }}
      >
        Next
      </Button>
    </Box>
  );
}

export default Pagination;