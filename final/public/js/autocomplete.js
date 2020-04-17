const search = document.getElementById("search_term");
const matchList = document.getElementById("match-list");

// Search data in json and filter it
const searchCities = async (searchText) => {
    const res = await fetch("../data/city.list.min.json");
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

search.addEventListener("input", () => searchCities(search.value));

// Show results in HTML
const outputHtml = (matches) => {
    if (matches.length > 0) {
        const html = matches
            .map((match) => {
                if (match.state != "") {
                    return `<div class="search-match">
                        <p>
                            <span class="search-match-name">${match.name}</span>
                            <span class="search-match-state"> (${match.state})</span>
                            <span class="search-match-country">, ${match.country}</span>
                        </p>
                        <p>
                            <span class="search-match-coord">
                                Lon: 
                                <span class="search-match-coord-lon">${match.coord.lon}</span>
                                , Lat: 
                                <span class="search-match-coord-lat">${match.coord.lat}</span>
                            </span>
                        </p>
                        <span class="search-match-id">${match.id}</span>
                    </div>
                    <hr class="search-match-separator">`;
                } else {
                    return `<div class="search-match">
                        <p>
                            <span class="search-match-name">${match.name}</span>
                            <span class="search-match-country">, ${match.country}</span>
                        </p>
                        <p>
                            <span class="search-match-coord">
                                Lon: 
                                <span class="search-match-coord-lon">${match.coord.lon}</span>
                                , Lat: 
                                <span class="search-match-coord-lat">${match.coord.lat}</span>
                            </span>
                        </p>
                        <span class="search-match-id">${match.id}</span>
                    </div>
                    <hr class="search-match-separator">`;
                }
            })
            .join("");

        matchList.innerHTML = '<hr class="search-match-separator">' + html;
    }
};
