import React from 'react';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LoaderCircle } from 'lucide-react';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
};

const MovieDetail = () => {
  const { id } = useParams(); 
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [aiData, setAiData] = useState(null); 
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${id}`, API_OPTIONS);
        const data = await response.json();
        setMovie(data);
      } catch (error) {
        console.error("Failed to fetch movie details", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovie();
  }, [id]); 

  useEffect(() => {
    const fetchAiData = async () => {
      if (movie && !aiData) {
        setIsAiLoading(true);
        try {
          const res = await fetch('/api/getMovieCompanion', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: movie.title, overview: movie.overview })
          });
          const data = await res.json();
          setAiData(data);
        } catch (error) {
          console.error('Failed to fetch AI Data ', error);
        } finally {
          setIsAiLoading(false);
        }
      }
    };

    fetchAiData();
  }, [movie, aiData]); 

  if (isLoading) {
    return (
      <div className="p-6 flex gap-2 text-white">
        <LoaderCircle className="animate-spin" />
        <span>Loading Movie...</span>
      </div>
    );
  }
  if (!movie) {
    return <div>Movie not found.</div>;
  }

  const { title, poster_path, overview, release_date, vote_average } = movie;

  return (
    <>
      <div className='flex flex-col md:flex-row gap-8 text-white'>
        <img 
          src={`https://image.tmdb.org/t/p/w500/${poster_path}`} 
          alt={title}
          className="w-full md:w-1/3 rounded-lg" 
        />
        <div className="flex-1 flex flex-col gap-4">
          <h1 className="text-4xl font-bold">{title}</h1>
          <p className="text-lg text-gray-300">{overview}</p>
          <p className="text-md">
            <span className="font-semibold">Release Date:</span> {release_date}
          </p>
          <p className="text-md">
            <span className="font-semibold">Rating:</span> {vote_average.toFixed(1)} / 10
          </p>
        </div>
      </div>

      <div className="ai-companion-section mt-12 text-white">
        {isAiLoading && (
          <div className="p-6 flex gap-2">
            <LoaderCircle className="animate-spin" />
            <span>Generating AI Movie Companion...</span>
          </div>
        )}
        
        {aiData && (
          <div>
            <h2 className="text-3xl font-bold mb-4">AI Movie Companion 🎬</h2>
            
            <h3 className="text-2xl font-semibold mt-4">Witty Review</h3>
            <p className="text-lg italic mt-2">{aiData.short_review}</p>

            <h3 className="text-2xl font-semibold mt-6">You Might Also Like...</h3>
            <ul className="list-disc list-inside mt-2 space-y-2">
              {aiData.similar_movies.map(m => (
                <li key={m.title}><strong>{m.title}:</strong> {m.reason}</li>
              ))}
            </ul>

            <h3 className="text-2xl font-semibold mt-6">Fun Facts</h3>
            <ul className="list-disc list-inside mt-2 space-y-2">
              {aiData.fun_facts.map((fact, index) => (
                <li key={index}>{fact}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default MovieDetail;