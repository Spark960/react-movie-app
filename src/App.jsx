import React, { useEffect, useState } from 'react'
import Search from './components/Search.jsx'
import Spinner from './components/Spinner.jsx';
import MovieCard from './components/MovieCard.jsx';
import { useDebounce } from 'react-use';
import { getTrendingMovies, updateSearchCount } from './appwrite.js';
import { LoaderCircle } from 'lucide-react';
import { Routes, Route } from "react-router-dom";
import MovieDetail from "./pages/MovieDetail.jsx";
import Home from "./pages/Home.jsx";


const App = () => {
    return (
    <main>
      <div className='pattern'/>
      <div className='wrapper'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetail />} /> {/* This is the new part! */}
        </Routes>
      </div>
    </main>
  );

}

export default App  