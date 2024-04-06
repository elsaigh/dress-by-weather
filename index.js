import express from "express"
import bodyParser from "body-parser"
import axios from "axios"
import 'dotenv/config'

const app = express()
const port = 3000

const key = process.env.API_KEY

app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/", async (req, res) => {
  res.render('index.ejs')
})

app.post('/location', async (req, res) => {

  const city = req.body.city
  const country = req.body.country

  var geocodeJSON
  try {
    const geocodeResponse = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${key}`)
    geocodeJSON = geocodeResponse.data
  } catch (error) {
    geocodeJSON = []
  }

  var lat, lon
  if (geocodeJSON.length === 0) {
    lat = 43.65
    lon = -79.38
  } else {
    lat = geocodeJSON[0].lat
    lon = geocodeJSON[0].lon
  }
  console.log(geocodeJSON)

  const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&appid=${key}`)
  const weatherJSON = weatherResponse.data
  //console.log(weatherJSON)

  const temp = weatherJSON.main.temp
  const atmosphere = weatherJSON.weather[0].main
  const location = weatherJSON.name

  var clothesResult
  switch (atmosphere) {
    case 'Rain':
    case 'Drizzle':
    case 'Thunderstorm':
      clothesResult = "Waterproof Jacket"
      break;
    case 'Snow':
      clothesResult = "Heavy Winter Jacket"
      break;
    default:
      clothesResult = "Normal Light Clothes"
      if (temp < 10) {
        clothesResult = "Warm Clothes"
      }
  }

  res.render("index.ejs", { 
    temp: temp,
    wear: clothesResult,
    location: location 
  })
})

app.listen(port, () => {
  console.log(`Server running on port: ${port}`)
})
