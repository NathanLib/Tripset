var city_name = $(".city-name")
    .text()
    .trim()
    .toLowerCase()
    .replace(/ *\([^)]*\) */g, "");

var photos = [];

var API_KEY = "7964577-4c82fb711d4b3cb0335bf6120";
var URL =
    "https://pixabay.com/api/?key=" +
    API_KEY +
    "&q=" +
    encodeURIComponent(city_name) +
    "&image_type=photo&category=backgrounds,nature,people,places,travel,buildings&pretty=true";

$.getJSON(URL, function (data) {
    if (parseInt(data.totalHits) > 0) {
        console.log(data);

        $.each(data.hits.slice(10), function (i, hit) {
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
    }
})
    .then(function () {
        displayPhotos(photos);
    })
    .then(function () {
        console.log($(".photos-content a"));
    });

function displayPhotos(photos) {
    photos.forEach((photo) => {
        // Node creation
        let a_city = $("<a>");
        // Add attribute (href, data) to the node
        a_city.attr("href", photo.largeImageURL);
        a_city.attr("data-title", photo.tags);
        a_city.attr("data-lightbox", "city-photos");

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
