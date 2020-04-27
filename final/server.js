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

var isFromFav = false;

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

var twit = new Twit({
    consumer_key: "Q2t0rbujnceDbvJgBHwxjAQmq",
    consumer_secret: "qnHhBe3Xr86HF2kQI4QWat1FjFIBla5W5GLfpzdBRK5AngdFfY",
    access_token: "4851224529-8Rtqhj93HCKAL2jXcQ8kgyaSUBqRSjY9js6ZXxU",
    access_token_secret: "8vxJgfRmobMCWmT7b3MzwC7OeeSUmiLUpVhOGuoMlNZpm",
});

//*************************** GET ROUTES ***************************
app.get("/tweets", function (req, res) {
    var tweets = [];

    var newyork = "NewYork";
    var lang = "en";
    var params = "(#" + newyork + ") min_faves:300 lang:" + lang;

    console.log(params);

    twit.get("search/tweets", {
        q: params,
        count: 8,
    })
        .catch(function (err) {
            console.log("caught error", err.stack);
        })
        .then(function (result) {
            result.data.statuses.forEach(function (data) {
                tweet = {
                    user: {
                        name: data.user.name,
                        screen_name: data.user.screen_name,
                        image: data.user.profile_image_url_https,
                    },
                    text: data.text,
                };

                tweets.push(tweet);
            });

            console.log(tweets);

            res.send(tweets);
        });
});

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
    if (!req.session.information) {
        res.redirect("/home");
        return;
    }

    var message;
    var favSubmit = false;

    var tweets = [];

    var country = req.session.information.city.name
        .replace(/ *\([^)]*\) */g, "")
        .replace(/\s+/g, "");

    var lang = req.session.information.city.country.toLowerCase();
    var params = "(#" + country + ") min_faves:300 lang:" + lang;

    console.log(params);

    if (req.session.favError) {
        message = req.session.favError;
        delete req.session.favError;
    }

    if (isFromFav) {
        favSubmit = true;
        isFromFav = false;
    }

    twit.get("search/tweets", {
        q: params,
        count: 8,
    })
        .catch(function (err) {
            console.log("caught error", err.stack);
        })
        .then(function (result) {
            console.log(result);

            result.data.statuses.forEach(function (data) {
                tweet = {
                    user: {
                        name: data.user.name,
                        screen_name: data.user.screen_name,
                        image: data.user.profile_image_url_https,
                    },
                    text: data.text,
                };

                tweets.push(tweet);
                console.log(tweet);
            });

            res.render("pages/information", {
                messageFavError: message,
                favSubmit: favSubmit,
                tweets: tweets,
            });
        });
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

app.get("*", function (req, res) {
    // everything else
    res.render("pages/home");
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

            if (isFromFav) {
                res.redirect("/information");
            } else {
                res.redirect("/profile");
            }
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
    var city_name = req.body.searchbarInput.split(",");
    var city_info = req.body.searchbarInputInformation.split(",");

    var city = {
        id: city_info[0].trim(),
        name: city_name[0].trim(),
        country: city_name[1].trim(),
        coord: {
            lat: city_info[1],
            lon: city_info[2],
        },
    };
    var dates = {
        start: req.body.inputDatesFrom,
        end: req.body.inputDatesTo,
    };

    req.session.information = {
        city: city,
        dates: dates,
    };

    // we add the city in the user's historic only if the user is already logged in
    if (req.session.loggedin) {
        // we chech if the city is not already in the user historic
        db.collection("profiles").findOne(
            {
                "login.email": req.session.user.email,
                "historic.id": req.session.information.city.id,
            },
            function (err, result) {
                if (err) throw err; //if there is an error, throw the error

                //if there is no result, we can continue the process
                if (!result) {
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
                } else {
                    db.collection("profiles").updateOne(
                        {
                            "login.email": req.session.user.email,
                        },
                        {
                            $pull: {
                                historic: { id: city.id },
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

    res.redirect("/information");
});

app.post("/dofav", function (req, res) {
    if (!req.session.loggedin) {
        isFromFav = true;
        res.redirect("/login");
        return;
    }

    var new_fav = req.session.information.city;

    // we chech if the city is not already in the user favourite
    db.collection("profiles").findOne(
        {
            "login.email": req.session.user.email,
            "favourites.id": req.session.information.city.id,
        },
        function (err, result) {
            if (err) throw err; //if there is an error, throw the error

            //if there is no result, we can continue the process
            if (!result) {
                db.collection("profiles").updateOne(
                    { "login.email": req.session.user.email },
                    { $push: { favourites: new_fav } },
                    function (err, result) {
                        if (err) throw err;
                        console.log("Saved to database");

                        //when complete redirect to the profile page
                        res.redirect("/profile");
                    }
                );
            } else {
                req.session.favError =
                    "This city is already in your favourites";
                res.redirect("/information");
            }
        }
    );
});

app.post("/selectCity", function (req, res) {
    var city_info = req.body.inputCityInfo.split(",");

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

    req.session.information = {
        city: city,
        dates: dates,
    };

    res.redirect("/information");
});
