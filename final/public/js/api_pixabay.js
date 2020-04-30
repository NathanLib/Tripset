// We retrieve the name of the city on the html page
// and we remove all the information that we don't want in the string.
var city_name = $(".city-name")
    .text()
    .trim()
    .toLowerCase()
    .replace(/ *\([^)]*\) */g, "");

var photos = [];

// Creating parameters for the API
var API_KEY = "7964577-4c82fb711d4b3cb0335bf6120";
var URL =
    "https://pixabay.com/api/?key=" +
    API_KEY +
    "&q=" +
    encodeURIComponent(city_name) +
    "&image_type=photo&category=backgrounds,nature,people,places,travel,buildings&pretty=true";

$.getJSON(URL, function (data) {
    if (parseInt(data.totalHits) > 0) {
        $.each(data.hits.slice(0, 10), function (i, hit) {
            var photo = {
                largeImageURL: hit.largeImageURL,
                previewURL: hit.previewURL,
                tags: hit.tags,
                pageURL: hit.pageURL,
            };

            photos.push(photo);
        });
    } else {
        console.log("No hits");
        $(".photos-header").text(
            "We're sorry, but no pictures of your town have been posted yet!"
        );
    }
}).then(function () {
    displayPhotos(photos);
});

function displayPhotos(photos) {
    photos.forEach((photo) => {
        // Node creation
        let a_city = $("<a>");
        // Add attribute (href, data) to the node
        a_city.attr("href", photo.largeImageURL);
        a_city.attr("data-lightbox", "city-photos");

        a_city.attr("data-title", photo.tags + " (" + photo.pageURL + ")");

        let img_city = $("<img>");
        img_city.attr("src", photo.previewURL);
        img_city.attr("alt", photo.tags);

        let p_city = $("<p>");
        p_city.attr("class", "gallery-photo-name");
        p_city.text(photo.tags);

        // Add all elements to the html page
        a_city.append(img_city);
        a_city.append(photo.tags);

        $(".photos-container .photos-content").append(a_city);
    });
}
