'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Slider from 'react-slick';

export default function Home() {
  const [nowShowing, setNowShowing] = useState([]);
  const [comingSoon, setComingSoon] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/movies?status=on show')
      .then(response => response.json())
      .then(data => setNowShowing(data))
      .catch(error => console.error('Error fetching now showing movies:', error));

    fetch('/api/movies?status=upcoming')
      .then(response => response.json())
      .then(data => setComingSoon(data))
      .catch(error => console.error('Error fetching upcoming movies:', error));
  }, []);

  const handleShowtimeClick = (movieId, showtime) => {
    router.push(`/transaction?movieId=${movieId}&showtime=${showtime}`);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1
        }
      }
    ]
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-gradient-to-r from-gray-100 to-gray-300 p-8">
      <section className="w-full max-w-5xl mb-8">
        <h2 className="text-4xl font-bold mb-6 text-gray-800 text-center">Now Showing</h2>
        <Slider {...settings} className="w-full">
          {nowShowing.map(movie => (
            <div key={movie.id} className="px-4">
              <div className="bg-white rounded-lg shadow-lg p-4 transition-transform transform hover:scale-105">
                <Image
                  src={movie.image}
                  alt={movie.title}
                  width={500}
                  height={300}
                  className="rounded-md mx-auto"
                />
                <h3 className="text-2xl font-semibold mt-4 text-gray-800 text-center">{movie.title}</h3>
                <p className="text-gray-600 mt-2 text-center">{movie.description}</p>
                <div className="mt-4">
                  <h4 className="text-lg font-medium text-gray-700 text-center">Showtimes:</h4>
                  <div className="flex flex-wrap justify-center gap-2 mt-2">
                    {movie.showtimes.map((time, index) => (
                      <button
                        key={index}
                        className="px-3 py-1 bg-black text-white rounded-md hover:bg-blue-600 transition-colors"
                        onClick={() => handleShowtimeClick(movie.id, time)}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </section>

      <section className="w-full max-w-5xl">
        <h2 className="text-4xl font-bold mb-6 text-gray-800 text-center">Coming Soon</h2>
        <Slider {...settings} className="w-full">
          {comingSoon.map(movie => (
            <div key={movie.id} className="px-4">
              <div className="bg-white rounded-lg shadow-lg p-4 transition-transform transform hover:scale-105">
                <Image
                  src={movie.image}
                  alt={movie.title}
                  width={500}
                  height={300}
                  className="rounded-md mx-auto"
                />
                <h3 className="text-2xl font-semibold mt-4 text-gray-800 text-center">{movie.title}</h3>
                <p className="text-gray-600 mt-2 text-center">{movie.description}</p>
              </div>
            </div>
          ))}
        </Slider>
      </section>
    </main>
  );
}
