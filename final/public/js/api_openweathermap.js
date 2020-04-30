// Retrieve latitude and longitude from html page
var lat = $("#city-hidden-coord-lat").text().trim();
var lon = $("#city-hidden-coord-lon").text().trim();

// Initialization of variables used with the API
var parameter = "";
var forecast = [];

// Retrieve travel dates from html page
var from = $(".city-dates-from").text().trim().split("-");
var to = $(".city-dates-to").text().trim().split("-");

// Creation of a new variable with today as value
var today = new Date();

// Array of days of the week
var days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

// Creation of two variables which respectively will have the value :
// today + 4 days and today + 7 days.
var today_plus_four = new Date();
var today_plus_seven = new Date();

// Initialization of the variable that will store the duration of the trip
var duration = 0;

// Initialization of the variable that will store the number of days
// between today and the starting date of the trip
var nb_days_from_today = 0;

//Check that dates have been entered
if (from.length == 3 && to.length == 3) {
    // Transforms strings into a Date object
    var from_date = new Date(from[0], from[1] - 1, from[2]);
    var to_date = new Date(to[0], to[1] - 1, to[2]);

    // To calculate the time difference of two dates
    var difference_in_time = from_date.getTime() - today.getTime();

    // Set the values of the both variables
    nb_days_from_today = Math.ceil(difference_in_time / (1000 * 3600 * 24));
    duration = to_date.getDate() - from_date.getDate() + 1;

    // Sets the values +4 and +7 to variables
    today_plus_four.setDate(today.getDate() + 4);
    today_plus_seven.setDate(today.getDate() + 7);
}

$(function () {
    // Creation of the parameters given to the API, from latitude and longitude.
    parameter = "lat=" + lat + "&lon=" + lon;

    // Retrieve the datas in json format
    $.getJSON(
        "https://api.openweathermap.org/data/2.5/onecall?" +
            parameter +
            "&units=metric" +
            "&appid=1cbf3ff50f97de871e10b1a6e7e2bd51",
        function (result) {
            // Browse the result item by item
            // and then create a new variable in JSON Object format
            result.daily.forEach(function (day) {
                var data = {
                    temp: {
                        min: day.temp.min,
                        max: day.temp.max,
                    },
                    weather: {
                        id: day.weather[0].id,
                        main: day.weather[0].main,
                        description: day.weather[0].description,
                    },
                };
                // Add each object in our main array
                forecast.push(data);
            });
        }
    )
        .then(function () {
            // Calls the function allowing to display the weather by passing to it in parameter
            // ithe adjusted array of days to be displayed.
            displayWeather(getSlicedForecast());
        })
        .then(function () {
            // Retrieve all html objects containing each day of the weather
            var children = $(".forecast-container .forecast");

            // if less than 5 days are displayed, change the layout of the elements.
            if (children.length <= 5) {
                $(".forecast-container").css("justify-content", "space-evenly");
            }

            $(".forecast-container")
                .find(".forecast")
                .each(function () {
                    // Function to slice the name of the day is the screen is too small
                    // Monday => Mon
                    if (document.body.clientWidth <= 768) {
                        sliceText($(this).find(".forecast-day"), 3);
                    }

                    // Function to add a separator between days (and their forecast)
                    // except on the last child
                    if ($(this).html() != $(".forecast").last().html()) {
                        $('<hr class="weather-separator" />').insertAfter(
                            $(this)
                        );
                    }
                });
        });
});

/* **********************************************************
Function allowing to cut out our array with all the weather
to keep only the days we want to display
The free API that Tripset uses allows you to get only 8 days
of weather prediction, including today
Depending on the dates selected by the user,
either the selected dates or the 8 days retrieved from the API are displayed.
********************************************************** */
function getSlicedForecast() {
    // If the selected end date is included in the 8 retrieved days,
    // the selected dates are displayed.
    if (to_date <= today_plus_seven) {
        $(".error-message-weather").text("");

        return forecast.slice(
            nb_days_from_today,
            nb_days_from_today + duration
        );
    }
    // if the selected end date is not included in the 8 retrieved days
    // but the departure date is included,
    // the days in the array are displayed from the departure date.
    // We still check that the departure date is in the first half of the 8 days array
    // because we want to avoid displaying the weather only for 1 or 2 days.
    else if (from_date <= today_plus_four) {
        // Creation of a warning message based on the user's situation
        $(".error-message-weather").text(
            "As Tripset uses a free API to get the forecast," +
                " we aren't able to show you more than " +
                forecast.slice(nb_days_from_today).length +
                " days after your starting date."
        );
        return forecast.slice(nb_days_from_today);
    }
    // If none of the above conditions are met,
    // the entire 8 days in the table will be displayed.
    else {
        // Creation of a warning message based on the user's situation
        $(".error-message-weather").text(
            "As Tripset uses a free API to get the forecast," +
                " we are able to show you only 8 days in advance from today."
        );
        return forecast;
    }
}

/* **********************************************************
Function to dynamically create the elements to display the weather 
then add them to the html page.
********************************************************** */
function displayWeather(slicedForecast) {
    // Browse each element of the array one by one
    slicedForecast.forEach((forecast, index) => {
        // Retrieve the name of the day browsed
        if (from_date != undefined) {
            var dayName = days[(from_date.getDay() + index) % 7];
        } else {
            var dayName = days[(today.getDay() + index) % 7];
        }

        // Node creation
        let div_forecast = $("<div>");
        // Add attribute (class, id, ...) to the node
        div_forecast.attr("class", "forecast");
        div_forecast.attr("id", "forecast-" + dayName.toLowerCase());

        let div_forecast_day = $("<div>");
        div_forecast_day.attr("class", "forecast-day");
        div_forecast_day.text(dayName);

        let div_forecast_icon = $("<div>");
        div_forecast_icon.attr("class", "forecast-icon");
        div_forecast_icon.attr("class", "animation-zoom-origin");

        let img_forecast_icon = $("<img>");
        img_forecast_icon.attr("src", getSrcImg(forecast.weather.id));

        // Call the function to get the right image according to the weather retrieved
        var lastslashindex = getSrcImg(forecast.weather.id).lastIndexOf("/");
        var alt = getSrcImg(forecast.weather.id)
            .substring(lastslashindex + 1)
            .replace(".svg", "");

        img_forecast_icon.attr("alt", alt);

        let div_forecast_temperature = $("<div>");
        div_forecast_temperature.attr("class", "forecast-temperature");

        let span_max_temp = $("<span>");
        span_max_temp.attr("class", "max-temp");
        span_max_temp.text(Math.floor(forecast.temp.max) + "\xB0");

        let span_min_temp = $("<span>");
        span_min_temp.attr("class", "min-temp");
        span_min_temp.text(Math.floor(forecast.temp.min) + "\xB0");

        let div_forecast_description = $("<div>");
        div_forecast_description.attr("class", "forecast-description");
        div_forecast_description.text(forecast.weather.main);

        // Add all elements to the html page
        div_forecast.append(div_forecast_day);

        div_forecast_icon.append(img_forecast_icon);
        div_forecast.append(div_forecast_icon);

        div_forecast_temperature.append(span_max_temp);
        div_forecast_temperature.append(span_min_temp);
        div_forecast.append(div_forecast_temperature);

        div_forecast.append(div_forecast_description);

        $(".forecast-container").append(div_forecast);
    });
}

/* **********************************************************
Function to set the right url of the weather animation 
according to the id retrieved with the API

All icons are from: https://www.amcharts.com/free-animated-svg-weather-icons/ 
********************************************************** */
function getSrcImg(id) {
    switch (true) {
        case id >= 200 && id < 300:
            var url = "/images/icons/Weather/thunder.svg";
            break;
        case id >= 300 && id < 400:
            var url = "/images/icons/Weather/rainy-7.svg";
            break;
        case id == 500:
            var url = "/images/icons/Weather/rainy-4.svg";
            break;
        case id == 501:
            var url = "/images/icons/Weather/rainy-5.svg";
            break;
        case id >= 502 && id <= 504:
            var url = "/images/icons/Weather/rainy-6.svg";
            break;
        case id == 511:
            var url = "/images/icons/Weather/snowy-4.svg";
            break;
        case id >= 520 && id < 600:
            var url = "/images/icons/Weather/rainy-6.svg";
            break;
        case id == 600:
            var url = "/images/icons/Weather/snowy-4.svg";
            break;
        case id == 601:
            var url = "/images/icons/Weather/snowy-5.svg";
            break;
        case id >= 602 && id < 700:
            var url = "/images/icons/Weather/snowy-6.svg";
            break;
        case id >= 700 && id < 800:
            var url = "/images/icons/Weather/cloudy.svg";
            break;
        case id == 800:
            var url = "/images/icons/Weather/day.svg";
            break;
        case id == 801:
            var url = "/images/icons/Weather/cloudy-day-2.svg";
            break;
        case id == 802:
            url = "/images/icons/Weather/cloudy-day-3.svg";
            break;
        case id >= 803 && id < 850:
            var url = "/images/icons/Weather/cloudy.svg";
            break;
        default:
            var url = "/images/icons/Weather/weather.svg";
            break;
    }

    return url;
}

/* **********************************************************
Function allowing to cut any text, taking in input parameters 
the html element and the number of characters you want to keep.
********************************************************** */
function sliceText(element, length) {
    // Retrieve the text from the html object
    // and removes all spaces from the character string
    var text = $.trim(element.html());

    var textSliced = text.slice(0, length);
    // Replace the text of the element
    element.text(textSliced);
}
