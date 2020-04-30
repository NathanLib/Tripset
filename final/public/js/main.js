/* =======================================================================

                                 General

   ======================================================================= */

// Check if a variable is null or not
const isNull = (value) => typeof value === "object" && !value;

// Variable to detect if the user is on Safari or not
var isSafari =
    navigator.vendor &&
    navigator.vendor.indexOf("Apple") > -1 &&
    navigator.userAgent &&
    navigator.userAgent.indexOf("CriOS") == -1 &&
    navigator.userAgent.indexOf("FxiOS") == -1;

/* ============================= Header ================================== */

/* **********************************************************
Function to open the navigation on mobile
********************************************************** */
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

/* **********************************************************
Function to close the navigation pannel on mobile
********************************************************** */
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

/* **********************************************************
Function to make the header disappear when the page is scrolled down
********************************************************** */
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

// Retrieve element from the html page
var errorMessage = $(".error-message");
var datesFrom = $("#input-dates-from");
var datesTo = $("#input-dates-to");

var today = new Date();

$(function () {
    // Display the dates container on click
    $(".searchbar-date-container").click(function () {
        addDatesContainer();
    });

    // if the user change the dates on the html page,
    // we call the function to change the calendar
    $("#input-dates-from, #input-dates-to").change(function () {
        manageCalendar();
    });

    // Safari does not support datetime inputs so this variable allows to detect
    // if the user is on this browser in order to tell him which date format he
    // has to enter in the inputs.
    if (isSafari) {
        $("#input-dates-from, #input-dates-to").attr(
            "placeholder",
            "yyyy-mm-dd"
        );

        $(".searchbar-container").css("margin-top", "20rem");
    }

    // if the user focus on the search bar, the list of suggestions appears
    // and the date container disappears to avoid having a too big display.
    $("#search_term").on("focus", function () {
        $("#match-list").css("display", "block");

        if ($(".dates-details").css("display") != "none") {
            addDatesContainer();
        }
    });

    // If the user clicks on one of the suggestions, all the information about it
    // is retrieved and displayed in the search bar.
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

        // Then the suggestion list disappears
        $("#match-list").css("display", "none");
    });
});

/* **********************************************************
Function to check if the form meets all the criteria (city + dates)
********************************************************** */
function validateForm() {
    if (datesValidation() && $("#search_term").data("id") != "") {
        return true;
    } else {
        alert("Please select one city in the list");
        return false;
    }
}

/* **********************************************************
Function to display the container where the dates are
********************************************************** */
function addDatesContainer() {
    // We make sure that the calendar is well created before the animate the container
    $.when(manageCalendar()).done(function () {
        // Depending on the size of the screen, the value of the animation changes
        if (document.body.clientWidth <= 992) {
            slideSearchContainer("8vh");
        } else if (document.body.clientWidth <= 1600) {
            slideSearchContainer("12vh");
        }

        // if the date container is displayed, the suggestion list disappears.
        if ($("#match-list").html() != "") {
            $("#match-list").html("");
        }

        $(".dates-details").slideToggle(700);
    });
}

/* **********************************************************
Function to animate the main container and move everything upwards 
to display as much as possible on the screen without the user needing to drag it down
********************************************************** */
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
                marginTop: "35vh",
            },
            700
        );
    }
}

/* **********************************************************
Function to return the month of the given date in 2-digit format
********************************************************** */
function getMonth(date) {
    var month = date.getMonth() + 1;
    return month < 10 ? "0" + month : "" + month;
}

/* **********************************************************
Function to return the day of the given date in 2-digit format
********************************************************** */
function getDate(date) {
    var date = date.getDate();
    return date < 10 ? "0" + date : "" + date;
}

/* **********************************************************
Function to create the calendar/date picker
********************************************************** */
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

/* **********************************************************
Function to modify the calendar/date picker if the user selects 
a date from the different inputs
********************************************************** */
function createCalendarWithRange(startDate, endDate) {
    // if a calendar was already created, we remove it first
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

/* **********************************************************
Function to display the submit button when the user starts 
to type something in the search bar
********************************************************** */
function displaySubmit() {
    $("#dates-submit").fadeIn(300, function () {
        $(this).css({
            display: "block",
        });
    });
}

/* **********************************************************
Function to manage the dates selected by the user 
and modify the calendar/date picker with the new dates
(display a range on the date picker)
********************************************************** */
function manageCalendar() {
    // if there is nothing, we just create our empty date picker
    if ($("#litepicker").is(":empty")) {
        createCalendar();
    }
    // if the user has just entered a start date, the end date is considered to be 7 days later,
    // in order to be able to display a range on the calendar.
    else if (isDatesFromCompleted() && !isDatesToCompleted()) {
        var startDate = new Date(datesFrom.val());

        var endDate = new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate() + 7
        );

        // Before sending the dates to the calendar, we check that they are correct.
        if (checkConsistencyDates(startDate, endDate)) {
            datesFrom.addClass("validated-dates");
            errorMessage.text("");

            createCalendarWithRange(startDate, endDate);
        }
    }
    // if the user entered both dates, we check they are correct
    // then, we send them to the date picker and we add a class to the inputs
    // to warn the user that the dates are good (the background of the inputs becomes lightgreen)
    else if (isDatesFromCompleted() && isDatesToCompleted()) {
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

/* **********************************************************
Function to verify that the start date is well after today's start date 
and the end date is well after the start date. 
+ creation of different error messages depending on the case
********************************************************** */
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

/* **********************************************************
Function to check if the starting date is not empty
********************************************************** */
function isDatesFromCompleted() {
    if (datesFrom.val() != "") {
        return true;
    } else {
        return false;
    }
}

/* **********************************************************
Function to check if the ending date is not empty
********************************************************** */
function isDatesToCompleted() {
    if (datesTo.val() != "") {
        return true;
    } else {
        return false;
    }
}

/* **********************************************************
Function to validate the different dates (before submit form)
********************************************************** */
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

/* **********************************************************
Function to verify that a particular date complies with all existing conditions. 
********************************************************** */
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

/* **********************************************************
Function to check if the day of the given date is correct
********************************************************** */
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

/* **********************************************************
Function to check if the month of the given date is correct
********************************************************** */
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

/* **********************************************************
Function to check the consistency between the day and the month 
of the given date
********************************************************** */
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

/* **********************************************************
Function to check the consistency between the day and the month 
of the given date in the particular case of February 29th 
********************************************************** */
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

/* **********************************************************
Function to check the year of the given date
********************************************************** */
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

/* **********************************************************
Function to add an animation on the date input if the date is not correct
and if the element is not empty
********************************************************** */
function errorDates(element, message) {
    errorMessage.text(message);

    if (!isNull(element)) {
        addAnimationError(element);
    }
}

/* **********************************************************
Function to create the animation when something is wrong
********************************************************** */
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

/* **********************************************************
Function to add the "validated" class to an element
********************************************************** */
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
    // get all the event titles on the html pages
    $(".event-content-title").each(function () {
        allTitles.push($.trim($(this).text()));
    });

    // call the function to slice the title a first time
    cutTitle();
});

// each time the user resize the window,
// we call again the function to slice the title
$(window).bind("resize", function () {
    cutTitle();
});

/* **********************************************************
Function to cut the articles'title if they are too long 
********************************************************** */
function cutTitle() {
    $(".event-content-title").each(function (index) {
        var titleSize = $.trim($(this).text()).length;
        var containerWidth = $(this).width();

        // Calculate the number of characters allowed in the container size
        // (based on pixels)
        var possibleNumberOfCharacters = Math.floor(containerWidth / 10);

        if (titleSize <= possibleNumberOfCharacters + 1) {
            $(this).text(allTitles[index]);
        } else {
            titleEllipsis($(this), possibleNumberOfCharacters - 1, index);
        }
    });
}

/* **********************************************************
Function to add the ellipsis (...) after that a title has been sliced
********************************************************** */
function titleEllipsis(element, length, index) {
    var textSliced = allTitles[index].slice(0, length) + "...";
    element.text(textSliced);
}

/* =======================================================================

                                Login page

   ======================================================================= */
("use strict");
// make the signup container appears and the login container desappears
$(".js-1").click(function () {
    $(".signup-holder").fadeIn(600).css({
        display: "flex",
    });
    $(".login-holder").fadeOut(0);
});

// do the reverse action
("use strict");
$(".js-2").click(function () {
    $(".login-holder").fadeIn(600);
    $(".signup-holder").fadeOut(0);
});

("use strict");
// check if the terms checkbox has been correctly selected
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

/* **********************************************************
Function to preview the profile image 
********************************************************** */
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
/* **********************************************************
Function to tell the user an email was sent to him
********************************************************** */
function sendEmail() {
    let emailSent = document.getElementById("email-sent");
    if (getComputedStyle(emailSent).display != "none") {
        emailSent.style.display = "none";
    } else {
        emailSent.style.display = "block";
    }
}

/* =======================================================================

                            Profile page

   ======================================================================= */

var colors = ["#f1faff", "#fff1fa", "#fafff1", "#f1f3ff", "#f1fffd", "#fff6f1"];

/* **********************************************************
Function to add a random background to the elements (cities)
in the favourites and historic sections
********************************************************** */
$(".city-bloc").css("background-color", function () {
    var random_color = colors[Math.floor(Math.random() * colors.length)];
    return random_color;
});

/* **********************************************************
Function to submit the form of the selected city in the favourites 
and historic sections
********************************************************** */
$(".city-bloc").click(function () {
    $(this).submit();
});
