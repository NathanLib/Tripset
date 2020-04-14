var input = $("#search_term");
var search_btn = $("#dates-submit");
var availableModels = [];

search_btn.click(function () {
    fetch(
        "https://api.openweathermap.org/data/2.5/weather?q=" +
            input.val() +
            "&appid=1cbf3ff50f97de871e10b1a6e7e2bd51"
    )
        .then((response) => response.json())
        .then((data) => {
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
