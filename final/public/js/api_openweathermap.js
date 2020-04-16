var lat = $("#city-hidden-coord-lat").text().trim();
var lon = $("#city-hidden-coord-lon").text().trim();
var from = $(".city-dates-from").text().trim().split("-");
var to = $(".city-dates-to").text().trim().split("-");
var today = new Date();
var parameter = "";
var forecast = [];
var count_days = 0;
var count_days_from_today = 0;

$(function () {
    if (from.length == 3 && to.length == 3) {
        var from_date = new Date(from[0], from[1] - 1, from[2]);
        var to_date = new Date(to[0], to[1] - 1, to[2]);

        today.setDate(today.getDate() + 7);
        if (to_date <= today) {
            count_days = to_date.getDate() - from_date.getDate() + 1;
            console.log(count_days);
            today.setDate(today.getDate() - 7);
            count_days_from_today = from_date.getDate() - today.getDate();
            console.log(count_days_from_today);
        }
    }

    parameter = "lat=" + lat + "&lon=" + lon;

    $.getJSON(
        "https://api.openweathermap.org/data/2.5/onecall?" +
            parameter +
            "&units=metric" +
            "&appid=1cbf3ff50f97de871e10b1a6e7e2bd51",
        function (result) {
            console.log(result);
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
    ).then(function () {
        console.log(forecast);
    });
});
