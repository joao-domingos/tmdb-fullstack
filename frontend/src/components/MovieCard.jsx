import { Card, CardMedia, CardContent, Typography } from '@mui/material';

const mockMovie = {
  title: 'Dead Poets Society',
  poster_path: '/9d5f9Vg5R2R1qS3qYJZ9YKWqT5g.jpg',
  vote_average: 8.4,
  release_date: '1989-06-02',
  genre_ids: [18, 107]
};

function MovieCard({ movie = mockMovie, genresList = [] }) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Poster';

  const year = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
  const genreNames = movie.genre_ids
    ? movie.genre_ids.slice(0, 3).map(id => {
        const genre = genresList.find(g => g.id === id);
        return genre ? genre.name : id;
      })
    : [];
  const rating = movie.vote_average ? movie.vote_average.toFixed(2) : 'N/A';

  return (
    <Card sx={{ width: 180, height: 400, display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        image={posterUrl}
        alt={movie.title}
        sx={{ width: 180, height: 260, objectFit: 'cover' }}
      />
      <CardContent sx={{ width: 180, height: 140, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Typography variant="subtitle1" noWrap>
          {movie.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {year}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {genreNames.length > 0 ? genreNames.join(', ') : 'N/A'}
        </Typography>
        <Typography variant="body2">
          Rating: {rating}/10
        </Typography>
      </CardContent>
    </Card>
  );
}

export default MovieCard;