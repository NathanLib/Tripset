/* =======================================================================

                                 General

   ======================================================================= */

const isNull = (value) => typeof value === "object" && !value;

// Safari does not support datetime inputs so this variable allows to detect
// if the user is on this browser in order to tell him which date format he
// has to enter in the inputs.
var isSafari =
    navigator.vendor &&
    navigator.vendor.indexOf("Apple") > -1 &&
    navigator.userAgent &&
    navigator.userAgent.indexOf("CriOS") == -1 &&
    navigator.userAgent.indexOf("FxiOS") == -1;

/* ============================= Header ================================== */

function openNav() {
    $(".mobileNav").css({
        width: "200px",
    });
    $(".mobileNav-background").fadeIn(600, function () {
        $(".mobileNav-background").css({
            display: "block",
        });
    });
}

function closeNav() {
    $(".mobileNav").css({
        width: "0",
    });
    $(".mobileNav-background").fadeOut(600, function () {
        $(".mobileNav-background").css({
            display: "none",
        });
    });
}

/* Function to make the header disappear when the page is scrolled down*/
$(function () {
    var prevScrollpos = window.pageYOffset;
    window.onscroll = function () {
        var currentScrollPos = window.pageYOffset;
        if (currentScrollPos > 30) {
            if (prevScrollpos > currentScrollPos) {
                $(".menu-background").fadeIn(250);
                $(".header-container").fadeIn(250);
            } else {
                $(".menu-background").fadeOut(250);
                $(".header-container").fadeOut(250);
            }
        } else {
            $(".menu-background").fadeOut(100);
        }
        prevScrollpos = currentScrollPos;
    };
});

/* =======================================================================

                                Home page

   ======================================================================= */

/* ================== Searchbar - Dates details ======================= */

var errorMessage = $(".error-message");
var today = new Date();

var datesFrom = $("#input-dates-from");
var datesTo = $("#input-dates-to");

$(function () {
    // $(".lds-ring").css("display", "inline-block");

    $(".searchbar-date-container").click(function () {
        addDatesContainer();
    });

    $("#input-dates-from, #input-dates-to").change(function () {
        manageCalendar();
    });

    if (isSafari) {
        $("#input-dates-from, #input-dates-to").attr(
            "placeholder",
            "yyyy-mm-dd"
        );
    }

    $("#search_term").on("focus", function () {
        $("#match-list").css("display", "block");

        if ($(".dates-details").css("display") != "none") {
            addDatesContainer();
        }
    });

    $("#match-list").on("click", ".search-match", function () {
        var id = $(this).find(".search-match-id").text();
        var lon = $(this).find(".search-match-coord-lon").text();
        var lat = $(this).find(".search-match-coord-lat").text();
        var name = $(this).find(".search-match-name").text();
        var country = $(this).find(".search-match-country").text();
        var state = $(this).find(".search-match-state").text();

        $("#search_term_information").val(id + "," + lat + "," + lon);
        $("#search_term").val(name + state + country);
        $("#search_term").data("id", id);

        $("#match-list").css("display", "none");
    });
});

function validateForm() {
    if (datesValidation() && $("#search_term").data("id") != "") {
        return true;
    } else {
        alert("Please select one city in the list");
        return false;
    }
}

function addDatesContainer() {
    $.when(manageCalendar()).done(function () {
        if (document.body.clientWidth <= 992) {
            slideSearchContainer("3rem");
        } else if (document.body.clientWidth <= 1600) {
            slideSearchContainer("5.5rem");
        }

        if ($("#match-list").html() != "") {
            $("#match-list").html("");
        }

        $(".dates-details").slideToggle(700);
    });
}

function slideSearchContainer(value) {
    if ($(".dates-details").css("display") == "none") {
        $(".searchbar-container").animate(
            {
                marginTop: value,
            },
            700
        );
    } else {
        $(".searchbar-container").animate(
            {
                marginTop: "12rem",
            },
            700
        );
    }
}

function getMonth(date) {
    var month = date.getMonth() + 1;
    return month < 10 ? "0" + month : "" + month;
}

function getDate(date) {
    var date = date.getDate();
    return date < 10 ? "0" + date : "" + date;
}

function createCalendar() {
    var picker = new Litepicker({
        element: document.getElementById("litepicker"),
        format: "YYYY-MM-DD",
        singleMode: false,
        allowRepick: true,
        inlineMode: true,
        numberOfMonths: 2,
        numberOfColumns: 2,
        minDate: new Date(),
        autoApply: true,
        showTooltip: false,
        showWeekNumbers: true,

        onSelect: (date1, date2) => {
            var startDate =
                date1.getFullYear() +
                "-" +
                getMonth(date1) +
                "-" +
                getDate(date1);

            var endDate =
                date2.getFullYear() +
                "-" +
                getMonth(date2) +
                "-" +
                getDate(date2);
            datesFrom.val(startDate);
            datesTo.val(endDate);
        },
    });
}

function createCalendarWithRange(startDate, endDate) {
    $("#litepicker").children().remove();

    var picker = new Litepicker({
        element: document.getElementById("litepicker"),
        format: "YYYY-MM-DD",
        singleMode: false,
        allowRepick: true,
        inlineMode: true,
        numberOfMonths: 2,
        numberOfColumns: 2,
        minDate: new Date(),
        autoApply: true,
        showTooltip: false,
        showWeekNumbers: true,

        startDate: startDate,
        endDate: endDate,

        onSelect: (date1, date2) => {
            var startDate =
                date1.getFullYear() +
                "-" +
                getMonth(date1) +
                "-" +
                getDate(date1);

            var endDate =
                date2.getFullYear() +
                "-" +
                getMonth(date2) +
                "-" +
                getDate(date2);
            datesFrom.val(startDate);
            datesTo.val(endDate);
        },
    });
}

function displaySubmit() {
    $("#dates-submit").fadeIn(300, function () {
        $(this).css({
            display: "block",
        });
    });
}

function manageCalendar() {
    if ($("#litepicker").is(":empty")) {
        createCalendar();
    } else if (isDatesFromCompleted() && !isDatesToCompleted()) {
        var startDate = new Date(datesFrom.val());

        var endDate = new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate() + 7
        );

        if (checkConsistencyDates(startDate, endDate)) {
            datesFrom.addClass("validated-dates");
            errorMessage.text("");

            createCalendarWithRange(startDate, endDate);
        }
    } else if (isDatesFromCompleted() && isDatesToCompleted()) {
        var startDate = new Date(datesFrom.val());
        var endDate = new Date(datesTo.val());

        if (checkConsistencyDates(startDate, endDate)) {
            datesFrom.addClass("validated-dates");
            datesTo.addClass("validated-dates");
            errorMessage.text("");

            createCalendarWithRange(startDate, endDate);
        }
    }
}

function checkConsistencyDates(startDate, endDate) {
    if (startDate >= today && endDate >= startDate) {
        return true;
    } else if (startDate <= today) {
        addAnimationError(datesFrom);
        errorMessage.text("The start date must be today or after");
        return false;
    } else if (endDate < startDate) {
        addAnimationError(datesTo);
        errorMessage.text("The end date must be after the start date");
        return false;
    } else {
        return false;
    }
}

function isDatesFromCompleted() {
    if (datesFrom.val() != "") {
        return true;
    } else {
        return false;
    }
}

function isDatesToCompleted() {
    if (datesTo.val() != "") {
        return true;
    } else {
        return false;
    }
}

function datesValidation() {
    if (datesFrom.val() != "") {
        var datesFrom_val = new Date(datesFrom.val());

        if (!checkDates(datesFrom_val, datesFrom)) {
            return false;
        } else {
            validatedDates(datesFrom_val, datesFrom);
        }
    }

    if (datesTo.val() != "") {
        var datesTo_val = new Date(datesTo.val());
        if (!checkDates(datesTo_val, datesTo)) {
            return false;
        } else {
            validatedDates(datesTo_val, datesTo);
        }
    }

    errorMessage.text("");
    return true;
}

function checkDates(date_val, date) {
    if (checkDays(date_val, date)) {
        return false;
    } else if (checkMonth30(date_val, date)) {
        return false;
    } else if (checkMonthLeap(date_val, date)) {
        return false;
    }

    if (checkMonth(date_val, date)) {
        return false;
    }
    if (checkYear(date_val, date)) {
        return false;
    }

    return true;
}

function checkDays(date_val, date) {
    if (
        (date_val.getDate() > 31 || date_val.getDate() < 1) &&
        date_val.getDate() != ""
    ) {
        var message = "This day doesn't exist";

        errorDates(date, message);
        return true;
    }
    return false;
}

function checkMonth(date_val, date) {
    if (
        (date_val.getMonth() > 12 || date_val.getMonth() < 1) &&
        date_val.getMonth() != ""
    ) {
        var message = "This is not the time to invent a month :)";
        errorDates(date, message);

        return true;
    }
    return false;
}

function checkMonth30(date_val, date) {
    if (
        (date_val.getMonth() == 4 ||
            date_val.getMonth() == 6 ||
            date_val.getMonth() == 9 ||
            date_val.getMonth() == 11) &&
        date_val.getDate() >= 31 &&
        date_val.getDate() != "" &&
        date_val.getMonth() != ""
    ) {
        var message = "There's only 30 days in this month!";
        errorDates(date, message);

        return true;
    }
    return false;
}

function checkMonthLeap(date_val, date) {
    if (date_val.getMonth() == 2 && date_val.getMonth() != "") {
        var isleap =
            date_val.getFullYear() % 4 == 0 &&
            (date_val.getFullYear() % 100 != 0 ||
                date_val.getFullYear() % 400 == 0);

        if (date_val.getDate() > 29 || (date_val.getDate() == 29 && !isleap)) {
            var message = "There is no such day!";
            errorDates(date, message);
            return true;
        }
    }
}

function checkYear(date_val, date) {
    if (
        (date_val.getFullYear() > 2050 || date_val.getFullYear() < 2000) &&
        date_val.getFullYear() != ""
    ) {
        var message = "You're looking a little too far for us here, sorry!";
        errorDates(date, message);

        return true;
    }
}

function errorDates(element, message) {
    errorMessage.text(message);

    if (!isNull(element)) {
        addAnimationError(element);
    }
}

function addAnimationError(element) {
    element.removeClass("validated-dates");
    element.addClass("wrong-shake");
    element.one(
        "webkitAnimationEnd oanimationend msAnimationEnd animationend",
        function (e) {
            element.delay(200).removeClass("wrong-shake");
        }
    );
}

function validatedDates(date_val, date) {
    if (
        date_val.getDate() != "" &&
        date_val.getMonth() != "" &&
        date_val.getFullYear() != ""
    ) {
        date.addClass("validated-dates");
    }
}

/* =======================================================================

                             Information page

   ======================================================================= */

/* ============================= Events ================================== */

var allTitles = [];

$(function () {
    $(".event-content-title").each(function () {
        allTitles.push($.trim($(this).text()));
    });

    cutTitle();
});

$(window).bind("resize", function () {
    cutTitle();
});

/** Function to cut the articles'title if they are too long */
function cutTitle() {
    $(".event-content-title").each(function (index) {
        var titleSize = $.trim($(this).text()).length;
        var containerWidth = $(this).width();
        var possibleNumberOfCharacters = Math.floor(containerWidth / 10);

        if (titleSize <= possibleNumberOfCharacters + 2) {
            $(this).text(allTitles[index]);
        } else {
            titleEllipsis($(this), possibleNumberOfCharacters - 1, index);
        }
    });
}

function titleEllipsis(element, length, index) {
    var textSliced = allTitles[index].slice(0, length) + "...";
    element.text(textSliced);
}

/* =======================================================================

                                Login page

   ======================================================================= */
("use strict");
$(".js-1").click(function () {
    $(".signup-holder").fadeIn(600).css({
        display: "flex",
    });
    $(".login-holder").fadeOut(0);
});

("use strict");
$(".js-2").click(function () {
    $(".login-holder").fadeIn(600);
    $(".signup-holder").fadeOut(0);
});

("use strict");

function checkBox() {
    if ($("#option").is(":checked")) {
        $(".signup-holder").fadeOut(0);
        $(".login-holder").fadeIn(600);
    } else {
        alert("You didn't agree to our terms :(");
    }
}

/* =======================================================================

                            Edit Profile

   ======================================================================= */

/** Function to preview the profile image
 * When the server side will be ready, the new image will be download to get the access */
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $("#profileImg").attr("src", e.target.result);
        };

        reader.readAsDataURL(input.files[0]);
    }
}

$("#newImg").change(function () {
    readURL(this);
});

/* =======================================================================

                            Reset Password

   ======================================================================= */
/*Function to tell the user an email was sent to him*/
function sendEmail() {
    let emailSent = document.getElementById("email-sent");
    if (getComputedStyle(emailSent).display != "none") {
        emailSent.style.display = "none";
    } else {
        emailSent.style.display = "block";
    }
}
