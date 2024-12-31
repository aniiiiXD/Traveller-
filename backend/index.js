const express = require("express");
const app = express();
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

app.use(express.json());
app.use(cors());

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Helper function to categorize time slots
const getTimeCategory = (time) => {
  const hour = parseInt(time.split(':')[0]);
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
};

// Parse individual activity
const parseActivity = (line) => {
  const match = line.match(/\*\s*(.*?)\((.*?)\):\s*(.*)/);
  if (match) {
    const timeStr = match[2].trim();
    return {
      timeSlot: match[1].trim(),
      time: timeStr,
      timeCategory: getTimeCategory(timeStr),
      description: match[3].trim()
    };
  }
  return null;
};

// Parse the generated text into structured data
const parseItineraryText = (text) => {
  const sections = text.split('\n\n');
  const parsedData = {
    destination: '',
    duration: '',
    itinerary: {},
    restaurants: [],
    travelTips: []
  };

  let currentSection = '';

  sections.forEach(section => {
    // Clean up the section text
    const cleanSection = section.trim();

    if (cleanSection.startsWith('**Destination:**')) {
      parsedData.destination = cleanSection.replace('**Destination:**', '').trim();
    }
    else if (cleanSection.startsWith('**Duration:**')) {
      parsedData.duration = cleanSection.replace('**Duration:**', '').trim();
    }
    else if (cleanSection.startsWith('**Day')) {
      const dayMatch = cleanSection.match(/\*\*Day (\d+):(.*?)\*\*/);
      if (dayMatch) {
        const dayNum = dayMatch[1];
        const dayTitle = dayMatch[2].trim();
        
        // Split activities by bullet points
        const activities = cleanSection
          .split('*')
          .filter(line => line.includes('('))
          .map(activity => {
            const timeMatch = activity.match(/\**(.*?)$$(.*?)$$:(.*)/);
            if (timeMatch) {
              return {
                timeSlot: timeMatch[1].trim(),
                time: timeMatch[2].trim(),
                timeCategory: getTimeCategory(timeMatch[2].trim()),
                description: timeMatch[3].trim()
              };
            }
            return null;
          })
          .filter(Boolean);

        // Group activities by time category
        const groupedActivities = {
          morning: activities.filter(a => a.timeCategory === 'morning'),
          afternoon: activities.filter(a => a.timeCategory === 'afternoon'),
          evening: activities.filter(a => a.timeCategory === 'evening')
        };

        parsedData.itinerary[`day${dayNum}`] = {
          title: dayTitle,
          schedule: groupedActivities,
          activities: activities
        };
      }
    }
    else if (cleanSection.startsWith('**Recommended Restaurants:**')) {
      parsedData.restaurants = cleanSection
        .split('*')
        .filter(line => line.trim().startsWith('**') === false)
        .map(restaurant => restaurant.trim())
        .filter(Boolean);
    }
    else if (cleanSection.startsWith('**Travel Tips:**')) {
      parsedData.travelTips = cleanSection
        .split('*')
        .filter(line => line.trim().startsWith('**') === false)
        .map(tip => tip.trim())
        .filter(Boolean);
    }
  });

  return parsedData;
};

app.post("/getDetails", async (req, res) => {
  try {
    const { state, city, days } = req.body;

    const prompt = `Create a detailed ${days}-day travel itinerary for ${city}, ${state}. 
                   Include daily activities, attractions, recommended restaurants, 
                   and travel tips. Provide a comprehensive guide for a tourist.
                   Give the result in structured JSON format with the following structure:
                   {
                     "Destination": "City, State",
                     "Duration": "X Days",
                     "Itinerary": [
                       {
                         "Day": "Day 1: Title",
                         "Activities": [
                           {
                             "Time": "time slot",
                             "Description": "activity description"
                           }
                         ],
                         "Attractions": [],
                         "Restaurants": [
                           {
                             "Name": "restaurant name",
                             "Cuisine": "cuisine type"
                           }
                         ]
                       }
                     ],
                     "TravelTips": []
                   }`;

    const result = await model.generateContent(prompt);
    const text = result.response.candidates[0].content.parts[0].text;
    
    // Clean the response text by removing markdown formatting
    const cleanedText = text.replace(/```json\n|\n```/g, '').trim();
    
    // Parse the cleaned text as JSON
    const jsonData = JSON.parse(cleanedText);
    
    res.json(jsonData);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: "Failed to generate or parse itinerary",
      details: error.message 
    });
  }
});



app.listen(3003, () => {
  console.log("Server is running on port 3003");
});