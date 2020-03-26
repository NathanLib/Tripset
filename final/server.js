const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");

const app = express();
const port = 8080;

app.use(express.static(__dirname + "/public"));

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

//Creates a Root Route
app.get("/", function(req, res) {
    res.render("pages/home");
});

app.get("/home", function(req, res) {
    res.render("pages/home");
});

app.get("/about", function(req, res) {
    res.render("pages/about");
});

app.get("/information", function(req, res) {
    res.render("pages/information");
});

app.get("/login", function(req, res) {
    res.render("pages/login");
});

app.get("/profile", function(req, res) {
    res.render("pages/profile");
});

app.get("/editProfile", function(req, res) {
    res.render("pages/editProfile");
});

app.get("/resetPwd", function(req, res) {
    res.render("pages/resetPwd");
});

//Starts the Express server with a callback
app.listen(port, function(err) {
    if (!err) {
        console.log("Server is running at port", port);
    } else {
        console.log(JSON.stringify(err));
    }
});
