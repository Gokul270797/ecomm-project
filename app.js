const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const connectDatabase = require("./config/db");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use("/public", express.static("public"));

connectDatabase();

const user = require("./routes/user");
const product = require("./routes/products");

app.use("/api/v1", user);
app.use("/api/v1", product);

app.listen('5000', ()=>{
    console.log('Server is running...!');
})