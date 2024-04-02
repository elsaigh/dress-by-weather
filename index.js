import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import 'dotenv/config'

const app = express();
const port = 3000;

const key = process.env.API_KEY

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  try {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${43.65}&lon=${79.38}&appid=${key}`);
    const result = response.data;
    console.log(result)
    res.render("index.ejs", { data: result });
  } catch (error) {
    res.render("index.ejs", { error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
