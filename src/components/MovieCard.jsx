import { Card, CardContent, Typography } from '@mui/material';

const mockMovie = {
  title: 'Dead Poets Society',
  vote_average: 8.4
};

function MovieCard({ movie = mockMovie }) {
  return (
    <Card sx={{ maxWidth: 300, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent>
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