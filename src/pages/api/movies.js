import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'db', 'db.json');

const readDB = () => {
  const data = fs.readFileSync(dbPath, 'utf-8');
  return JSON.parse(data);
};

export default (req = NextApiRequest, res = NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const db = readDB();
      const { status, time, date, movieId } = req.query;

      if (movieId) {
        const movie = db.movies.find(movie => movie.id === parseInt(movieId, 10));
        if (!movie) {
          return res.status(404).json({ error: 'Movie not found' });
        }
        return res.status(200).json(movie);
      }

      let movies = db.movies;

      if (status) {
        movies = movies.filter(movie => movie.status.toLowerCase() === status.toLowerCase());
      }

      if (date) {
        movies = movies.filter(movie => movie.release_date === date);
      }

      if (time) {
        // Logic to filter movies by time, if applicable
      }

      res.status(200).json(movies);
    } catch (error) {
      console.error('Error during fetching movies:', error);
      res.status(500).json({ error: 'An error occurred. Please try again.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
