const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017/tripset";
const dbName = "tripset";
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const salt = "$2b$10$YJ6Y1PnM4KQzPyAr3gjj3e";

var Twit = require("twit");

const app = express();
const port = 8080;

// Boolean variable to detect if you have just clicked
// on the "Save this city" button
// but you are not yet logged in/registered on the site
var isFromFav = false;

// Allows to use files in the folder /public
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

//Creation of the twitter client used to retrieve tweets
var twit = new Twit({
    consumer_key: "Q2t0rbujnceDbvJgBHwxjAQmq",
    consumer_secret: "qnHhBe3Xr86HF2kQI4QWat1FjFIBla5W5GLfpzdBRK5AngdFfY",
    access_token: "4851224529-8Rtqhj93HCKAL2jXcQ8kgyaSUBqRSjY9js6ZXxU",
    access_token_secret: "8vxJgfRmobMCWmT7b3MzwC7OeeSUmiLUpVhOGuoMlNZpm",
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
    // if no city was correctly selected in the previous step,
    // we return to the main page.
    if (!req.session.information) {
        res.redirect("/home");
        return;
    }

    // Variable used to store error messages
    var message;

    // Variable given as a parameter to detect
    // if the "Save this city" button has been clicked.
    var favSubmit = false;

    // Variables used to retrieve tweets
    var tweets = [];
    var country = req.session.information.city.name
        .replace(/ *\([^)]*\) */g, "")
        .replace(/\s+/g, "");
    var params = "(#" + country + ") min_faves:300 lang:en";

    // Passing the message value
    // then delete the session variable where the message was stored
    if (req.session.favError) {
        message = req.session.favError;
        delete req.session.favError;
    }

    // Passing the boolean value
    // and reset the main variable to false
    if (isFromFav) {
        favSubmit = true;
        isFromFav = false;
    }

    // Retrieve the tweets
    twit.get("search/tweets", {
        q: params,
        count: 8,
    })
        .catch(function (err) {
            console.log("caught error", err.stack);
        })
        .then(function (result) {
            // Browse the result to retrieve only the necessary data
            result.data.statuses.forEach(function (data) {
                tweet = {
                    user: {
                        name: data.user.name,
                        screen_name: data.user.screen_name,
                        image: data.user.profile_image_url_https,
                    },
                    text: data.text.replace(/(?:https?|ftp):\/\/[\n\S]+/g, ""),
                    link: data.text.match(/(?:https?|ftp):\/\/[\n\S]+/g),
                };

                // Store each data in the array
                tweets.push(tweet);
            });

            // Passes all necessary variables as parameters to display them
            // on the html page.
            res.render("pages/information", {
                messageFavError: message,
                favSubmit: favSubmit,
                tweets: tweets,
            });
        });
});

app.get("/login", function (req, res) {
    // Passing the message value
    // then delete the session variable where the message was stored
    if (req.session.loginError) {
        var message = req.session.loginError;
        delete req.session.loginError;
        res.render("pages/login", {
            messageError: message,
        });
    } else if (req.session.loginValidation) {
        var message = req.session.loginValidation;
        delete req.session.loginValidation;
        res.render("pages/login", {
            messageValidation: message,
        });
    } else {
        res.render("pages/login");
    }
});

app.get("/profile", function (req, res) {
    // Check if the user is well logged in
    // if not, we redirect the user to the login form
    if (!req.session.loggedin) {
        res.redirect("/login");
        return;
    }

    // Retrieves information from the user who has the same email
    // address as the one stored in the session variable.
    db.collection("profiles").findOne(
        {
            "login.email": req.session.user.email,
        },
        function (err, result) {
            //if there is an error, throw the error
            if (err) throw err;
            //finally we just send the result to the user page as "user"
            res.render("pages/profile", {
                user: result,
            });
        }
    );
});

app.get("/editProfile", function (req, res) {
    // Check if the user is well logged in
    // if not, we redirect the user to the login form
    if (!req.session.loggedin) {
        res.redirect("/login");
        return;
    }

    // Retrieves information from the user who has the same email
    // address as the one stored in the session variable.
    db.collection("profiles").findOne(
        {
            "login.email": req.session.user.email,
        },
        function (err, result) {
            //if there is an error, throw the error
            if (err) throw err;
            //finally we just send the result to the user page as "user"
            res.render("pages/editProfile", {
                user: result,
            });
        }
    );
});

app.get("/resetPwd", function (req, res) {
    res.render("pages/resetPwd");
});

// logout route cause the page to Logout.
// it sets our session.loggedin to false and then redirects the user to the home page
app.get("/logout", function (req, res) {
    req.session.loggedin = false;
    req.session.destroy();
    res.redirect("/");
});

// Avoid to get error if someone write a page that doesn't exist
app.get("*", function (req, res) {
    res.render("pages/home");
});

//*************************** POST ROUTES **************************

// the dologin route detasl with the data from the login screen.
// the post variables, username and password ceom from the form on the login page.
app.post("/dologin", function (req, res) {
    // Retrieve information that the user wrote in the inputs of the html page
    var email = req.body.email;
    var pword = req.body.password;

    // We verify that the user already exist in our database by comparing email addresses.
    db.collection("profiles").findOne({ "login.email": email }, function (
        err,
        result
    ) {
        // if there is an error, throw the error
        if (err) throw err;
        // if there is no result, redirect the user back to the login system as that email must not exist
        if (!result) {
            req.session.loginError = "This email doesn't exist";
            res.redirect("/login");
            return;
        }

        // Encrypt the password from the form
        // then compare the password with the one stored in the database,
        // if the password is correct, set session loggedin to true and send the user to the good page
        const hash = bcrypt.hashSync(pword, salt);
        if (hash == result.login.password) {
            req.session.loggedin = true;
            req.session.user = {
                first: result.name.first,
                last: result.name.last,
                email: result.login.email,
            };

            // The redirection differs depending on the page the user comes from
            if (isFromFav) {
                res.redirect("/information");
            } else {
                res.redirect("/profile");
            }
        }
        // if the password doesn't match, send the user back to login
        else {
            req.session.loginError = "This user doesn't exist";
            res.redirect("/login");
        }
    });
});

app.post("/dosignup", function (req, res) {
    // Retrieve information that the user wrote in the inputs of the html page
    var email = req.body.email;
    var pword = req.body.password;

    // Encrypt the password from the form before inserting it in the database
    const hash = bcrypt.hashSync(pword, salt);

    // Creation of the variable that will be stored in the database
    // with the different information of the new user
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

    // We verify that the user does not already exist in our database by comparing email addresses.
    db.collection("profiles").findOne({ "login.email": email }, function (
        err,
        result
    ) {
        //if there is an error, throw the error
        if (err) throw err;
        //if there is no result, we can continue the process
        if (!result) {
            //once created we just run the data string against the database and all our new data will be saved
            db.collection("profiles").insertOne(datatostore, function (
                err,
                result
            ) {
                //if there is an error, throw the error
                if (err) throw err;
                console.log("Saved to database");

                //when complete redirect to the login page
                req.session.loginValidation =
                    "Your profile has been created successfully, please login now";
                res.redirect("/login");
            });
        } else {
            // if the email is already used for another account,
            // we create an error message and we redirect the user to the login page
            req.session.loginError = "This email is already used";
            res.redirect("/login");
        }
    });
});

app.post("/getinformation", function (req, res) {
    // Retrieve the information about the city in the different inputs of the main page
    var city_name = req.body.searchbarInput.split(",");
    var city_info = req.body.searchbarInputInformation.split(",");

    // Creation of a variable that will store all the information
    // about the city
    var city = {
        id: city_info[0].trim(),
        name: city_name[0].trim(),
        country: city_name[1].trim(),
        coord: {
            lat: city_info[1],
            lon: city_info[2],
        },
    };
    // Creation of a variable that will store all the information
    // about the travel dates
    var dates = {
        start: req.body.inputDatesFrom,
        end: req.body.inputDatesTo,
    };

    // We create an new object with the two previous variable
    // that we store in the session variable
    req.session.information = {
        city: city,
        dates: dates,
    };

    // We add the city in the user's historic only if the user is already logged in
    if (req.session.loggedin) {
        // We chech if the city is not already in the user historic
        db.collection("profiles").findOne(
            {
                "login.email": req.session.user.email,
                "historic.id": req.session.information.city.id,
            },
            function (err, result) {
                // if there is an error, throw the error
                if (err) throw err;

                // if there is no result, we can continue the process
                if (!result) {
                    // Update the historic of the logged user
                    // $slice allows to have a " rolling " array with only 8 entries
                    // (use negative value for the last items)
                    db.collection("profiles").updateOne(
                        {
                            "login.email": req.session.user.email,
                        },
                        {
                            $push: {
                                historic: {
                                    $each: [city],
                                    $slice: -8,
                                },
                            },
                        },
                        function (err, result) {
                            // if there is an error, throw the error
                            if (err) throw err;
                        }
                    );
                } else {
                    // if there is a result, we update the historic of the user
                    // by changing the place of the city searched
                    // As mongoDB does not allow to do two actions at the same time,
                    // it is necessary to remove first the city from the array then add it at the end.
                    db.collection("profiles").updateOne(
                        {
                            "login.email": req.session.user.email,
                        },
                        {
                            $pull: {
                                historic: {
                                    id: city.id,
                                },
                            },
                        },
                        function (err, result) {
                            if (err) throw err;
                        }
                    );

                    db.collection("profiles").updateOne(
                        {
                            "login.email": req.session.user.email,
                        },
                        {
                            $push: {
                                historic: {
                                    $each: [city],
                                    $slice: -8,
                                },
                            },
                        },
                        function (err, result) {
                            if (err) throw err;
                        }
                    );
                }
            }
        );
    }

    // Once we retrieved all the information,
    // we redirect the user to the information page
    res.redirect("/information");
});

// Method to add a city in the user favourites
app.post("/dofav", function (req, res) {
    // if the user is not logged in yet but this method has been activated
    // it means that the user is from the information page (isFromFav = true)
    if (!req.session.loggedin) {
        isFromFav = true;
        res.redirect("/login");
        return;
    }

    // We retrieve the information of city searched that are stored in a session variable
    var new_fav = req.session.information.city;

    // we chech if the city is not already in the user favourite
    // with the user email and the city id
    db.collection("profiles").findOne(
        {
            "login.email": req.session.user.email,
            "favourites.id": req.session.information.city.id,
        },
        function (err, result) {
            // if there is an error, throw the error
            if (err) throw err;
            // if there is no result, we can continue the process
            if (!result) {
                // We update the favourites array (with the funciton $push) of the user logged in
                db.collection("profiles").updateOne(
                    {
                        "login.email": req.session.user.email,
                    },
                    { $push: { favourites: new_fav } },
                    function (err, result) {
                        if (err) throw err;
                        console.log("Saved to database");

                        // when complete redirect to the profile page
                        res.redirect("/profile");
                    }
                );
            } else {
                // if there is a result in the database, we create an error message
                // and we redirect the user to the information page
                req.session.favError =
                    "This city is already in your favourites";
                res.redirect("/information");
            }
        }
    );
});

// Method to click on a city in the user profile page
// (from the favourite or historic section)
app.post("/selectCity", function (req, res) {
    var city_info = req.body.inputCityInfo.split(",");

    // We create new variables with the information of the city that the user selected
    var city = {
        id: city_info[0].trim(),
        name: city_info[1].trim(),
        country: city_info[2].trim(),
        coord: {
            lat: city_info[3].trim(),
            lon: city_info[4].trim(),
        },
    };
    var dates = {
        start: "",
        end: "",
    };

    // Then we store the variable in the same variable session that we use for a research
    // it allows to simulation a research on the home page
    req.session.information = {
        city: city,
        dates: dates,
    };

    res.redirect("/information");
});

// Avoid to get error if someone write a page that doesn't exist
app.post("*", function (req, res) {
    res.redirect("/home");
});
