const express = require("express"); 
const app =express(); 
const cors = require("cors"); 
const { GoogleGenerativeAI} = require("@google/generative-ai")



app.use(express.json());
app.use(cors());

const genAI = new GoogleGenerativeAI(); 
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post("/getDetails", async (req,res)=>{

    const { state , city , days } = req.body;

    const prompt = `Create a detailed ${days}-day travel itinerary for ${city}, ${state}. 
              Include daily activities, attractions, recommended restaurants, 
              and travel tips. Provide a comprehensive guide for a tourist.
              Give the result in the json object, in a hierarchy such that it can be parsed.
              `

    const result = await model.generateContent(prompt);
    res.json({
        itenary : result,
    }) 
})


app.listen(3003,()=>{
    console.log("yoooo server is up bois")
})
