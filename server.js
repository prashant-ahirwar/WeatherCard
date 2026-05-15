import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();



/* ---------------- PATH SETUP ---------------- */

const __filename =
  fileURLToPath(import.meta.url);

const __dirname =
  path.dirname(__filename);



/* ---------------- MIDDLEWARE ---------------- */

app.use(cors());

app.use(
  express.static(__dirname)
);



/* ---------------- CONFIG ---------------- */

const PORT =
  process.env.PORT || 3000;

const API_KEY =
  process.env.API_KEY;



/* ---------------- FRONTEND ROUTE ---------------- */

app.get("/", (req, res) => {

  res.sendFile(
    path.join(__dirname, "index.html")
  );

});



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