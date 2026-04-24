import { createContext, useContext, useReducer, useEffect } from 'react';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

const initialState = {
  movies: [],
  genres: [],
  loading: false,
  error: null,
  filters: {
    query: '',
    genre: null,
    year: null,
    rating: null,
    sortBy: 'popularity.desc',
  },
  page: 1,
  totalPages: 1,
};

function movieReducer(state, action) {
  switch (action.type) {
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload }, page: 1 };
    case 'SET_PAGE':
      return { ...state, page: action.payload };
    case 'SET_MOVIES':
      return { ...state, movies: action.payload.movies, totalPages: action.payload.totalPages };
    case 'SET_GENRES':
      return { ...state, genres: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

async function fetchMovies(dispatch, filters, page) {
  dispatch({ type: 'SET_LOADING', payload: true });
  try {
    const params = new URLSearchParams({
      api_key: TMDB_API_KEY,
      sort_by: filters.sortBy,
      page,
      ...(filters.genre && { with_genres: filters.genre }),
      ...(filters.year && { primary_release_year: filters.year }),
      ...(filters.rating && { 'vote_average.gte': filters.rating }),
      ...(filters.query && { query: filters.query }),
    });

    const url = filters.query
      ? `${BASE_URL}/search/movie?${params}`
      : `${BASE_URL}/discover/movie?${params}`;

    const response = await fetch(url);
    const data = await response.json();

    dispatch({ type: 'SET_MOVIES', payload: { movies: data.results, totalPages: data.total_pages } });
    dispatch({ type: 'SET_LOADING', payload: false });
  } catch (error) {
    dispatch({ type: 'SET_ERROR', payload: error.message });
    dispatch({ type: 'SET_LOADING', payload: false });
  }
}

const MovieContext = createContext();

export function MovieProvider({ children }) {
  const [state, dispatch] = useReducer(movieReducer, initialState);

  useEffect(() => {
    fetch(`${BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`)
      .then(res => res.json())
      .then(data => dispatch({ type: 'SET_GENRES', payload: data.genres || [] }))
      .catch(() => {});
  }, []);

  return (
    <MovieContext.Provider value={{ state, dispatch, fetchMovies }}>
      {children}
    </MovieContext.Provider>
  );
}

export function useMovie() {
  return useContext(MovieContext);
}
