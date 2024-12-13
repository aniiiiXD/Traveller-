import React from 'react';
import bg from '../assets/neom-YeLs9lJDx9M-unsplash.jpg'
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import SearchBar from '../components/SearchBar';

const Home = () => {
  return (
    <div className="relative h-screen w-full">
      <div className="absolute inset-0">
        <img
          src={bg}
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <SearchBar />
      </div>
    </div>
  );
};

export default Home;