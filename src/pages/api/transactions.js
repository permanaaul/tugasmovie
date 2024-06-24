import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'db', 'db.json');

const readDB = () => {
  const data = fs.readFileSync(dbPath, 'utf-8');
  return JSON.parse(data);
};

const writeDB = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

export default (req, res) => {
  if (req.method === 'POST') {
    try {
      const db = readDB();
      const { uid, movie_id, time, total_seat, date } = req.body;

      // Check if the movie is on show
      const movie = db.movies.find(
        (movie) => movie.id === movie_id && movie.status.toLowerCase() === 'on show'
      );
      if (!movie) {
        return res.status(400).json({ error: 'Movie is not on show' });
      }

      // Check seat availability
      if (movie.seat_available < total_seat) {
        return res.status(400).json({ error: 'Not enough seats available' });
      }

      // Deduct the available seats
      movie.seat_available -= total_seat;

      // Calculate total price
      const total_price = movie.price * total_seat;

      // Create transaction
      const transaction = {
        uid,
        movie_id,
        time,
        total_seat,
        date,
        total_price,
      };
      db.transactions.push(transaction);

      // Write to database
      writeDB(db);

      res.status(201).json(transaction);
    } catch (error) {
      console.error('Error during transaction:', error);
      res.status(500).json({ error: 'An error occurred. Please try again.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
