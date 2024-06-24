'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaCheckCircle } from 'react-icons/fa';

export default function TransactionPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const movieId = searchParams.get('movieId');
  const showtime = searchParams.get('showtime');
  const [totalSeats, setTotalSeats] = useState(1);
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetch(`/api/movies?movieId=${movieId}`)
      .then(response => response.json())
      .then(data => setMovie(data))
      .catch(error => console.error('Error fetching movie details:', error));
  }, [movieId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: Date.now().toString(),
          movie_id: parseInt(movieId, 10),
          time: showtime,
          total_seat: totalSeats,
          date: new Date().toISOString().split('T')[0]
        })
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error);
      } else {
        setSuccess(data);
        setError('');
      }
    } catch (err) {
      console.error('Error during transaction:', err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-200 to-gray-400">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Transaction</h2>
        {movie && (
          <div className="mb-6 text-center">
            <Image
              src={movie.image}
              alt={movie.title}
              width={300}
              height={200}
              className="rounded-md mx-auto"
            />
            <h3 className="text-2xl font-semibold mt-4 text-gray-800">{movie.title}</h3>
          </div>
        )}
        {error && (
          <p className="text-red-500 mb-4 p-4 bg-red-100 rounded-md">
            {error}
          </p>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-100 rounded-md text-green-700 flex items-center">
            <FaCheckCircle className="text-3xl mr-4"/>
            <div>
              <p className="text-xl font-semibold">Transaction successful!</p>
              <p className="mt-2">Movie: {movie.title}</p>
              <p>Total Price: {success.total_price}</p>
              <p>Showtime: {success.time}</p>
              <p>Total Seats: {success.total_seat}</p>
              <p>Date: {success.date}</p>
            </div>
          </div>
        )}
        {!success && (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Total Seats</label>
              <input
                type="number"
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                value={totalSeats}
                onChange={(e) => setTotalSeats(e.target.value)}
                required
                min="1"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold p-3 rounded-md shadow-lg transition duration-300"
            >
              Book Now
            </button>
          </form>
        )}
        <p className="mt-6 text-center text-gray-600">
          <button
            onClick={() => router.push('/')}
            className="text-green-500 hover:text-green-600 font-medium"
          >
            Back to Home
          </button>
        </p>
      </div>
    </div>
  );
}
