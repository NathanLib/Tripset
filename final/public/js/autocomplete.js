const search = document.getElementById("search_term");
const matchList = document.getElementById("match-list");

// Search data in json and filter it
const searchCities = async (searchText) => {
    // const res = await fetch("../data/city.list.min.json");
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

search.addEventListener("input", () => searchCities(search.value));

// Show results in HTML
const outputHtml = (matches) => {
    if (matches.length > 0) {
        const html = matches
            .map((match) => {
                if (match.state != "") {
                    return `<div>
                        <p>
                            ${match.name} (${match.state}), ${match.country}
                        </p>
                        <span class="match-coord">
                            ${match.coord.lon}, ${match.coord.lat}
                        </span>
                        <span class="match-id">${match.id}</span>
                    </div>`;
                } else {
                    return `<div>
                        <p>
                            ${match.name}, ${match.country}
                        </p>
                        <span class="match-coord">
                            ${match.coord.lon}, ${match.coord.lat}
                        </span>
                        <span class="match-id">${match.id}</span>
                    </div>`;
                }
            })
            .join("");

        matchList.innerHTML = html;
    }
};
