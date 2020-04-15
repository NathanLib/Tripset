var input = $("#search_term");
var search_btn = $("#dates-submit");
var availableModels = [];
var parameter = "";

search_btn.click(function () {
    if (input.data("id") != "") {
        parameter = "id=" + input.data("id");
        console.log(parameter);
    } else {
        parameter = "q=" + input.val();
        console.log(parameter);
    }

    fetch(
        "https://api.openweathermap.org/data/2.5/weather?" +
            parameter +
            "&units=metric" +
            "&appid=1cbf3ff50f97de871e10b1a6e7e2bd51"
    )
        .then((response) => response.json())
        .then((data) => {
            console.log(data);

            var tempValue = data["main"]["temp"];
            var nameValue = data["name"];
            var descValue = data["weather"][0]["description"];

            console.log(
                "name : " +
                    nameValue +
                    "\n" +
                    "Desc : " +
                    descValue +
                    "\n" +
                    "Temp : " +
                    tempValue
            );

            // main.innerHTML = nameValue;
            // desc.innerHTML = "Desc - " + descValue;
            // temp.innerHTML = "Temp - " + tempValue;
            // input.value = "";
        })

        .catch((err) => alert("Wrong city name!"));
});
