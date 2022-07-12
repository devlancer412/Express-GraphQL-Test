
const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const apiRouter = require('./apis');

// Configure Environment
require('dotenv').config();

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

const port = 8080;

app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(apiRouter);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});