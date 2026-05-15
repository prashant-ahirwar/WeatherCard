import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());

const PORT = 3000;

const API_KEY = process.env.API_KEY;



/* ---------------- WEATHER ROUTE ---------------- */

app.get("/weather", async (req, res) => {

  try {

    const city =
      req.query.city || "Indore";

    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=7&aqi=no&alerts=no`
    );

    const data = await response.json();



    /* ------------ INVALID CITY ------------ */

    if(data.error){

      return res.status(404).json({
        error:data.error.message
      });
    }



    /* ------------ SEND WEATHER ------------ */

    res.json(data);

  } catch(error){

    console.log(error);

    res.status(500).json({
      error:"Failed to fetch weather data"
    });

  }
});



/* ---------------- SERVER ---------------- */

app.listen(PORT, () => {

  console.log(`
🌤 Weather Server Running

→ http://localhost:${PORT}
  `);

});