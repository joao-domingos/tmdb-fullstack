import { Card, CardMedia, CardContent, Typography } from '@mui/material';

const mockMovie = {
  title: 'Dead Poets Society',
  poster_path: '/9d5f9Vg5R2R1qS3qYJZ9YKWqT5g.jpg',
  vote_average: 8.4
};

function MovieCard({ movie = mockMovie }) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Poster';

  return (
    <Card sx={{ width: 220, height: 380, display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        image={posterUrl}
        alt={movie.title}
        sx={{ width: 220, height: 300, objectFit: 'cover' }}
      />
      <CardContent sx={{ width: 220, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Typography variant="h6" noWrap>
          {movie.title}
        </Typography>
        <Typography>
          Rating: {movie.vote_average}/10
        </Typography>
      </CardContent>
    </Card>
  );
}

export default MovieCard;