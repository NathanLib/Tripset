const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017/tripset";
const dbName = "tripset";
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const salt = "$2b$10$YJ6Y1PnM4KQzPyAr3gjj3e";

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

MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
    if (err) throw err;
    db = client.db(dbName);
    //Starts the Express server
    app.listen(port, function(err) {
        if (!err) {
            console.log("Server is running at port", port);
        } else {
            console.log(JSON.stringify(err));
        }
    });
});

//*************************** GET ROUTES ***************************

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

//logout route cause the page to Logout.
//it sets our session.loggedin to false and then redirects the user to the login
app.get("/logout", function(req, res) {
    req.session.loggedin = false;
    console.log(req.session);
    req.session.destroy();
    console.log(req.session);
    res.redirect("/");
});

//*************************** POST ROUTES **************************

// the dologin route detasl with the data from the login screen.
// the post variables, username and password ceom from the form on the login page.
app.post("/dologin", function(req, res) {
    var email = req.body.email;
    var pword = req.body.password;

    db.collection("profiles").findOne({ "login.email": email }, function(
        err,
        result
    ) {
        if (err) throw err; //if there is an error, throw the error

        //if there is no result, redirect the user back to the login system as that email must not exist
        if (!result) {
            res.redirect("/login");
            return;
        }

        //encrypt the password from the form before compare it with database
        const hash = bcrypt.hashSync(pword, salt);

        //if there is a result then check the password, if the password is correct set session loggedin to true and send the user to the index
        if (hash == result.login.password) {
            req.session.loggedin = true;
            req.session.email = result.login.email;

            res.redirect("/profile");
        }
        //otherwise send them back to login
        else {
            res.redirect("/login");
        }
    });
});

app.post("/dosignup", function(req, res) {
    var pword = req.body.password;

    //encrypt the password from the form before inserting it with database
    const hash = bcrypt.hashSync(pword, salt);

    var datatostore = {
        name: {
            first: req.body.firstname,
            last: req.body.lastname
        },
        login: {
            email: req.body.email,
            password: hash
        },
        favourites: [],
        historic: []
    };

    //once created we just run the data string against the database and all our new data will be saved
    db.collection("profiles").insertOne(datatostore, function(err, result) {
        if (err) throw err;
        console.log("Saved to database");
        //when complete redirect to the login page
        res.redirect("/login");
    });
});
