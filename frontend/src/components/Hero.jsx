import React from 'react'

const Hero = () => {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col justify-center items-start h-[calc(100vh-80px)]">
      <div className="text-lg text-white mb-4">Your Travel Services</div>
      <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6">
        BEST ESCAPE CHOICE
      </h1>
      <p className="text-xl text-gray-400 max-w-xl">
        Hassle Free Travel planner - relax and enjoy the trip
      </p>
    </div>
  )
}

export default Hero