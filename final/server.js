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
        saveUninitialized: true,
    })
);

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

// These lines allow the session variables to be used directly in the pages
//  USE : <%= session.myVar %>
app.use(function (request, response, next) {
    response.locals.session = request.session;
    next();
});

app.set("view engine", "ejs");

MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
    if (err) throw err;
    db = client.db(dbName);
    //Starts the Express server
    app.listen(port, function (err) {
        if (!err) {
            console.log("Server is running at port", port);
        } else {
            console.log(JSON.stringify(err));
        }
    });
});

//*************************** GET ROUTES ***************************

app.get("/", function (req, res) {
    res.render("pages/home");
});

app.get("/home", function (req, res) {
    res.render("pages/home");
});

app.get("/about", function (req, res) {
    res.render("pages/about");
});

app.get("/information", function (req, res) {
    res.render("pages/information");
});

app.get("/login", function (req, res) {
    if (req.session.loginError) {
        var message = req.session.loginError;
        delete req.session.loginError;
        res.render("pages/login", { messageError: message });
    } else if (req.session.loginValidation) {
        var message = req.session.loginValidation;
        delete req.session.loginValidation;
        res.render("pages/login", { messageValidation: message });
    } else {
        res.render("pages/login");
    }
});

app.get("/profile", function (req, res) {
    if (!req.session.loggedin) {
        res.redirect("/login");
        return;
    }

    db.collection("profiles").findOne(
        {
            "login.email": req.session.user.email,
        },
        function (err, result) {
            if (err) throw err;
            //finally we just send the result to the user page as "user"
            res.render("pages/profile", {
                user: result,
            });
        }
    );
});

app.get("/editProfile", function (req, res) {
    if (!req.session.loggedin) {
        res.redirect("/login");
        return;
    }

    db.collection("profiles").findOne(
        {
            "login.email": req.session.user.email,
        },
        function (err, result) {
            if (err) throw err;
            //finally we just send the result to the user page as "user"
            console.log(result);

            res.render("pages/editProfile", {
                user: result,
            });
        }
    );
});

app.get("/resetPwd", function (req, res) {
    res.render("pages/resetPwd");
});

//logout route cause the page to Logout.
//it sets our session.loggedin to false and then redirects the user to the login
app.get("/logout", function (req, res) {
    req.session.loggedin = false;
    req.session.destroy();
    res.redirect("/");
});

//*************************** POST ROUTES **************************

// the dologin route detasl with the data from the login screen.
// the post variables, username and password ceom from the form on the login page.
app.post("/dologin", function (req, res) {
    var email = req.body.email;
    var pword = req.body.password;

    db.collection("profiles").findOne({ "login.email": email }, function (
        err,
        result
    ) {
        if (err) throw err; //if there is an error, throw the error

        //if there is no result, redirect the user back to the login system as that email must not exist
        if (!result) {
            req.session.loginError = "This email doesn't exist";
            res.redirect("/login");
            return;
        }

        //encrypt the password from the form before compare it with database
        const hash = bcrypt.hashSync(pword, salt);

        //if there is a result then check the password, if the password is correct set session loggedin to true and send the user to the index
        if (hash == result.login.password) {
            req.session.loggedin = true;
            req.session.user = {
                first: result.name.first,
                last: result.name.last,
                email: result.login.email,
            };

            res.redirect("/profile");
        }
        //otherwise send them back to login
        else {
            req.session.loginError = "This user doesn't exist";
            res.redirect("/login");
        }
    });
});

app.post("/dosignup", function (req, res) {
    var email = req.body.email;
    var pword = req.body.password;

    //encrypt the password from the form before inserting it with database
    const hash = bcrypt.hashSync(pword, salt);

    var datatostore = {
        name: {
            first: req.body.firstname,
            last: req.body.lastname,
        },
        login: {
            email: email,
            password: hash,
        },
        favourites: [],
        historic: [],
        registered: Date(),
    };

    //we chech if the email of the new user is not already saved in our database
    db.collection("profiles").findOne({ "login.email": email }, function (
        err,
        result
    ) {
        if (err) throw err; //if there is an error, throw the error
        //if there is no result, we can continue the process
        if (!result) {
            //once created we just run the data string against the database and all our new data will be saved
            db.collection("profiles").insertOne(datatostore, function (
                err,
                result
            ) {
                if (err) throw err;
                console.log("Saved to database");
                //when complete redirect to the login page
                req.session.loginValidation =
                    "Your profile has been created successfully, please login now";
                res.redirect("/login");
            });
        } else {
            req.session.loginError = "This email is already used";
            res.redirect("/login");
        }
    });
});

app.post("/getinformation", function (req, res) {
    req.session.forecast = forecast;
    res.redirect("/information");
});
