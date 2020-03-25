const express = require("express"); //npm install express
const session = require("express-session");
const bodyParser = require("body-parser");
const app = express();

app.use(session({ secret: "example" }));

app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

app.set("view engine", "ejs");
