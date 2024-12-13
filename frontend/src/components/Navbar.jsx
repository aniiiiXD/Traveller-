import React from 'react';
import { Bell, Globe } from 'lucide-react';

const Navbar = () => {
  return (
    <div className="w-full  shadow-md sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center px-8 py-4">
        
        <div className="flex items-center">
          <span className="text-orange-500 text-3xl font-semibold">Trip</span>
          <span className="text-white text-2xl">ify</span>
        </div>

        
        <div className="space-x-6 text-lg">
          <a href="#" className="text-white hover:text-gray-300 hover:underline">Home</a>
          <a href="#" className="text-white hover:text-gray-300 hover:underline">About us</a>
          <a href="#" className="text-white hover:text-gray-300 hover:underline">Service</a>
          <a href="#" className="text-white hover:text-gray-300 hover:underline">Blogs</a>
        </div>

        
        <div className="flex items-center space-x-4">
          <button className="text-white">
            <Globe size={24} />
          </button>
          <button className="flex items-center space-x-2 px-4 py-1 border bg-orange-600 text-white rounded-md hover:bg-white  hover:border-orange hover:text-orange-600 hover:text-xl">
            <Bell size={24} />
            <span>SignUp</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
