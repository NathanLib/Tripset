const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");

const app = express();

app.use(
    session({
        secret: "nC0@#1pM/-0qA1+é",
        name: "Tripset",
        resave: true,
        saveUninitialized: true
    })
);

app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

app.set("view engine", "ejs");

app.listen(8080);
console.log("listening on 8080");
