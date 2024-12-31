import React, { useState } from 'react';

const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

const SearchBar = () => {
  const [formData, setFormData] = useState({
    city: '',
    state: '',
    days: 1
  });
  const [loading, setLoading] = useState(false);
  const [tripDetails, setTripDetails] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTripDetails(null);
    setError(null);

    try {
      const response = await fetch("https://traveller-backendapi.vercel.app/getDetails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        mode:'cors'
      });

      if (!response.ok) {
        throw new Error('Failed to generate itinerary');
      }

      const data = await response.json();
      console.log(data)
      if (data.error) {
        throw new Error(data.error);
      }

      setTripDetails(data);
    } catch (error) {
      setError(error.message || 'Failed to generate trip details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex flex-col">
            <label htmlFor="state" className="text-sm text-gray-600 mb-1">State</label>
            <select
              id="state"
              value={formData.state}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            >
              <option value="">Select State</option>
              {indianStates.map((stateName) => (
                <option key={stateName} value={stateName}>
                  {stateName}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="city" className="text-sm text-gray-600 mb-1">City</label>
            <input
              type="text"
              id="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="Enter City"
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="days" className="text-sm text-gray-600 mb-1">No. of Days</label>
            <input
              type="number"
              id="days"
              value={formData.days}
              onChange={handleInputChange}
              placeholder="Enter No. of days"
              min="1"
              max="14"
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div className="flex items-end">
            <button
              className="w-full bg-orange-500 px-4 py-2 rounded-md text-white hover:bg-orange-600 transition-colors disabled:bg-gray-400"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </span>
              ) : 'Generate My Trip'}
            </button>
          </div>
        </div>
      </form>

      {loading && (
        <div className="flex justify-center items-center mt-8">
          <div className="animate-pulse text-center">
            <div className="text-gray-600">Planning your perfect trip...</div>
            <div className="text-sm text-gray-500 mt-2">This may take a few moments</div>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {tripDetails && !loading && (
        <div className="mt-8 bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-orange-500 text-white px-6 py-4">
            <h2 className="text-2xl font-bold">{tripDetails.Destination}</h2>
            <p className="text-lg opacity-90">{tripDetails.Duration}</p>
          </div>

          <div className="p-6">
            {/* Itinerary Section */}
            {tripDetails.Itinerary.map((dayData, index) => (
              <div key={index} className="mb-8 last:mb-0">
                <div className="flex items-center mb-4">
                  <div className="bg-orange-100 text-orange-800 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {dayData.Day}
                  </h3>
                </div>

                {/* Activities Timeline */}
                <div className="space-y-4 mt-4">
                  {dayData.Activities.map((activity, actIndex) => (
                    <div key={actIndex} className="flex items-start bg-orange-50 rounded-lg p-4">
                      <span className="font-medium text-orange-800 min-w-[140px]">
                        {activity.Time}
                      </span>
                      <span className="ml-4 text-gray-700">
                        {activity.Description}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Attractions */}
                <div className="mt-6 bg-orange-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-orange-800 mb-3">
                    Key Attractions
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {dayData.Attractions.map((attraction, attrIndex) => (
                      <div key={attrIndex} className="flex items-center">
                        <span className="text-orange-500 mr-2">•</span>
                        <span className="text-gray-700">{attraction}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Restaurants */}
                <div className="mt-6 bg-orange-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-orange-800 mb-3">
                    Recommended Restaurants
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dayData.Restaurants.map((restaurant, restIndex) => (
                      <div key={restIndex} className="bg-white rounded-lg p-3 shadow-sm">
                        <div className="font-medium text-orange-800">
                          {restaurant.Name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {restaurant.Cuisine}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* Travel Tips Section */}
            <div className="mt-8 bg-orange-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-orange-800 mb-4">Travel Tips</h3>
              <ul className="space-y-3">
                {tripDetails.TravelTips.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-orange-500 mr-3">•</span>
                    <span className="text-gray-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;