var input = $("#search_term");
var search_btn = $("#dates-submit");
var parameter = "";
var forecast = [];

$(function () {
    if (input.data("id") != "") {
        parameter = "lat=" + input.data("lat") + "&lon=" + input.data("lon");
        console.log(parameter);

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
                    console.log(data);
                    forecast.push(data);
                });
            }
        ).then(function () {
            console.log(forecast);
            $.post("/getinformation", {
                forecast: forecast,
            });
        });
    } else {
        alert("Please select one city in the list");
    }
});
