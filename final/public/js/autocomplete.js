const search = document.getElementById("search_term");
const matchList = document.getElementById("match-list");

// Search data in json and filter it
const searchCities = async (searchText) => {
    const res = await fetch("../data/sample_cities.json");
    const cities = await res.json();

    // Get matches to current text input
    let matches = cities.filter((city) => {
        const regex = new RegExp(`^${searchText}`, "gi");
        return city.name.match(regex);
    });

    // Allows to empty the array if you delete what you have written.
    if (searchText.length === 0) {
        matches = [];
        matchList.innerHTML = "";
    }

    outputHtml(matches);
};

// Show results in HTML
const outputHtml = (matches) => {
    if (matches.length > 0) {
        const html = matches
            .map(
                (match) => `
                <div>
                    <h4>${match.name}, ${match.country}</h4>
                </div>`
            )
            .join("");

        matchList.innerHTML = html;
    }
};

search.addEventListener("input", () => searchCities(search.value));

// $.getJSON(
//     "https://raw.githubusercontent.com/lutangar/cities.json/master/cities.json",
//     function (result) {
//         // console.log(result);
//     }
// );
