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

  const fetchMovie = async () => {
    setIsLoading(true);
    const response = await fetch(`https://api.themoviedb.org/3/movie/${id}`, API_OPTIONS);
    console.log(response);
    const data = await response.json();
    console.log("Movie data:", data);
    
    setMovie(data);
    setIsLoading(false);
  }

  useEffect(()=> {
    fetchMovie();
    
    
    
  }, [id]);
  if (isLoading) {
  return (
    <div className="p-6 flex gap-2 text-white">
      <LoaderCircle className="animate-spin" />
      <span>Loading...</span>
    </div>
  );

   
    
}
const {title, overview, release_date, backdrop_path} = movie;

  return (
   
    
    <div className='flex flex-col md:flex-row gap-8 text-white'>
       <img 
        src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} 
        alt={movie.title}
        className="w-full md:w-1/3 rounded-lg" 
      />
       <div className="flex-1 flex flex-col gap-4">
        <h1 className="text-4xl font-bold">{title}</h1>
        
        <p className="text-lg text-gray-300">{movie.overview}</p>
        
        <p className="text-md">
          <span className="font-semibold">Release Date:</span> {movie.release_date}
        </p>
        
        <p className="text-md">
          <span className="font-semibold">Rating:</span> {movie.vote_average.toFixed(1)} / 10
        </p>
      </div>
    </div>
  )
}

export default MovieDetail      