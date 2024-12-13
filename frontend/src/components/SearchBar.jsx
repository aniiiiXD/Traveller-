import React, { useState } from 'react'

const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
]

const SearchBar = () => {
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [days, setDays] = useState(1)
  const [loading, setLoading] = useState(false)
  const [tripDetails, setTripDetails] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTripDetails(null);

    try {
      const response = await fetch("http://localhost:3003/getDetails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ state, city, days }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log(data);

      // Parse the Gemini response text 
      const parsedTripDetails = JSON.parse(data.itinerary.response.candidates[0].content.parts[0]);
      console.log(parsedTripDetails)
      setTripDetails(parsedTripDetails);

    } catch (error) {
      console.error("Error fetching itinerary:", error);
      alert('Failed to generate trip details. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 flex space-x-4 justify-center items-center"
      >
        {/* State Selection Dropdown */}
        <div className="flex flex-col">
          <label htmlFor="state" className="text-sm text-gray-600 mb-1">State</label>
          <select
            id="state"
            value={state}
            onChange={(e) => setState(e.target.value)}
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

        {/* City Input */}
        <div className="flex flex-col">
          <label htmlFor="city" className="text-sm text-gray-600 mb-1">City</label>
          <input
            type="text"
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter City"
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>

        {/* Number of Days Input */}
        <div className="flex flex-col">
          <label htmlFor="days" className='text-sm text-gray-600 mb-1'>No. of Days</label>
          <input 
            type="number"
            id="days"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            placeholder='Enter No. of days'
            min="1"
            max="14"
            className='border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500'
          />
        </div>

        {/* Submit Button */}
        <div className='flex justify-center items-center'>
          <button
            className='bg-orange-500 px-4 py-2 rounded-md text-white hover:bg-orange-600 transition-colors'
            type='submit'
          >
            Generate My Trip
          </button>
        </div>
      </form>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center mt-6">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
          <span className="ml-3 text-gray-600">Generating your trip details...</span>
        </div>
      )}

      {/* Trip Details Display */}
      {!loading && tripDetails && (
        <div className="mt-6 bg-gray-100 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{city}, {state} Trip Itinerary</h2>

          {/* Overview Section */}
          {tripDetails.overview && (
            <div className="bg-white p-4 rounded-md mb-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-700 mb-3">Trip Overview</h3>
              <p className="text-gray-600">{tripDetails.overview}</p>
            </div>
          )}

          {/* Daily Itinerary */}
          <div className="space-y-6">
            {tripDetails.days.map((day, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="bg-orange-500 text-white px-4 py-3">
                  <h3 className="text-xl font-bold">{day.day}</h3>
                </div>
                
                <div className="p-4">
                  {day.sections.map((section, sectionIndex) => (
                    <div 
                      key={sectionIndex} 
                      className="mb-4 pb-4 border-b last:border-b-0 border-gray-200"
                    >
                      <h4 className="font-semibold text-gray-800 mb-2">
                        {section.title}
                      </h4>
                      <p className="text-gray-600">
                        {section.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Travel Tips Section */}
          {tripDetails.tips && tripDetails.tips.length > 0 && (
            <div className="mt-6 bg-orange-50 p-5 rounded-lg">
              <h3 className="text-xl font-semibold text-orange-800 mb-4">
                Travel Tips
              </h3>
              <ul className="list-disc list-inside text-orange-700 space-y-2">
                {tripDetails.tips.map((tip, index) => (
                  <li key={index} className="text-gray-700">{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchBar;