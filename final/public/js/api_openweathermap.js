var lat = $("#city-hidden-coord-lat").text().trim();
var lon = $("#city-hidden-coord-lon").text().trim();

var parameter = "";
var forecast = [];

var from = $(".city-dates-from").text().trim().split("-");
var to = $(".city-dates-to").text().trim().split("-");

var today = new Date();
var days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

var today_plus_four = new Date();
var today_plus_seven = new Date();

var duration = 0;
var nb_days_from_today = 0;

if (from.length == 3 && to.length == 3) {
    var from_date = new Date(from[0], from[1] - 1, from[2]);
    var to_date = new Date(to[0], to[1] - 1, to[2]);

    nb_days_from_today = from_date.getDate() - today.getDate();
    duration = to_date.getDate() - from_date.getDate() + 1;

    today_plus_four.setDate(today.getDate() + 4);
    today_plus_seven.setDate(today.getDate() + 7);
}

$(function () {
    parameter = "lat=" + lat + "&lon=" + lon;

    $.getJSON(
        "https://api.openweathermap.org/data/2.5/onecall?" +
            parameter +
            "&units=metric" +
            "&appid=1cbf3ff50f97de871e10b1a6e7e2bd51",
        function (result) {
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
                forecast.push(data);
            });
        }
    )
        .then(function () {
            displayWeather(getSlicedForecast());
        })
        .then(function () {
            var children = $(".forecast-container .forecast");
            if (children.length <= 5) {
                $(".forecast-container").css("justify-content", "space-evenly");
            }

            $(".forecast-container")
                .find(".forecast")
                .each(function () {
                    /* Function to add a separator between days (and their forecast) */
                    if (document.body.clientWidth <= 768) {
                        sliceText($(this).find(".forecast-day"), 3);
                    }

                    if ($(this).html() != $(".forecast").last().html()) {
                        $('<hr class="weather-separator" />').insertAfter(
                            $(this)
                        );
                    }
                });

            var current_temp = $(".forecast-container")
                .find(".forecast:first-child .max-temp")
                .text();
            var current_description = $(".forecast-container")
                .find(".forecast:first-child .forecast-description")
                .text();
            $(".input-info-save-favourite").val(
                current_temp + "," + current_description
            );
        });
});

function getSlicedForecast() {
    if (to_date <= today_plus_seven) {
        $(".error-message-weather").text("");
        return forecast.slice(
            nb_days_from_today,
            nb_days_from_today + duration
        );
    } else if (from_date <= today_plus_four) {
        $(".error-message-weather").text(
            "As Tripset uses a free API to get the forecast," +
                " we aren't able to show you more than " +
                forecast.slice(nb_days_from_today).length +
                " days after your starting date."
        );
        return forecast.slice(nb_days_from_today);
    } else {
        $(".error-message-weather").text(
            "As Tripset uses a free API to get the forecast," +
                " we are able to show you only 8 days in advance from today."
        );
        return forecast;
    }
}

function displayWeather(slicedForecast) {
    slicedForecast.forEach((forecast, index) => {
        if (from_date != undefined) {
            var dayName = days[(from_date.getDay() + index) % 7];
        } else {
            var dayName = days[(today.getDay() + index) % 7];
        }

        let div_forecast = $("<div>");
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

function sliceText(element, length) {
    var text = $.trim(element.html());

    var textSliced = text.slice(0, length);
    element.text(textSliced);
}
