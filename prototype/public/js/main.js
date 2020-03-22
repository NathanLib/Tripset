/* =======================================================================

                                 General

   ======================================================================= */

const isNull = value => typeof value === "object" && !value;

/* ============================= Header ================================== */

function openNav() {
    $(".mobileNav").css({
        width: "50vw"
    });
    $(".mobileNav-background").fadeIn(600, function() {
        $(".mobileNav-background").css({
            display: "block"
        });
    });
}

function closeNav() {
    $(".mobileNav").css({
        width: "0"
    });
    $(".mobileNav-background").fadeOut(600, function() {
        $(".mobileNav-background").css({
            display: "none"
        });
    });
}

/* Function to make the header disappear when the page is scrolled down*/
$(function() {
    var prevScrollpos = window.pageYOffset;
    window.onscroll = function() {
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

var textFrom = $("#dates-text-from");
var textTo = $("#dates-text-to");

var errorMessage = $(".error-message");
var today = new Date();

var datesFrom = $("#input-dates-from");
var datesTo = $("#input-dates-to");

$(function() {
    $("#dates-submit").click(function() {
        submitResearch();
    });

    $(".searchbar-date-container").click(function() {
        addDatesContainer();
    });

    $("#input-dates-from, #input-dates-to").change(function() {
        manageCalendar();
    });
});

function addDatesContainer() {
    $.when(manageCalendar()).done(function() {
        if (document.body.clientWidth <= 992) {
            slideSearchContainer("3rem");
        } else if (document.body.clientWidth <= 1600) {
            slideSearchContainer("5.5rem");
        }

        $(".dates-details").slideToggle(700);
    });
}

function slideSearchContainer(value) {
    if ($(".dates-details").css("display") == "none") {
        $(".searchbar-container").animate(
            {
                marginTop: value
            },
            700
        );
    } else {
        $(".searchbar-container").animate(
            {
                marginTop: "12rem"
            },
            700
        );
    }
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
            datesFrom.val(date1.format("YYYY-MM-DD"));
            datesTo.val(date2.format("YYYY-MM-DD"));
        }
    });
}

function createCalendarWithRange(startDate, endDate) {
    $("#litepicker")
        .children()
        .remove();

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
            datesFrom.val(date1.format("YYYY-MM-DD"));
            datesTo.val(date2.format("YYYY-MM-DD"));
        }
    });
}

function displaySubmit() {
    $("#dates-submit").fadeIn(300, function() {
        $(this).css({
            display: "block"
        });
    });
}

function submitResearch() {
    // if (datesValidation()) {
    $("#dates-form").submit();
    $("#location-form").submit();
    // } else {
    //     alert("There is an error in the selected dates");
    // }
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
    var dayFrom_val = dayFrom.val();
    var monthFrom_val = monthFrom.val();
    var yearFrom_val = yearFrom.val();

    var dayTo_val = dayTo.val();
    var monthTo_val = monthTo.val();
    var yearTo_val = yearTo.val();

    if (
        !checkDates(
            dayFrom_val,
            monthFrom_val,
            yearFrom_val,
            dayFrom,
            monthFrom,
            yearFrom
        )
    ) {
        return false;
    } else {
        validatedDates(
            dayFrom_val,
            monthFrom_val,
            yearFrom_val,
            dayFrom,
            monthFrom,
            yearFrom
        );
    }

    if (
        !checkDates(dayTo_val, monthTo_val, yearTo_val, dayTo, monthTo, yearTo)
    ) {
        return false;
    } else {
        validatedDates(
            dayTo_val,
            monthTo_val,
            yearTo_val,
            dayTo,
            monthTo,
            yearTo
        );
    }

    errorMessage.text("");
    return true;
}

function checkDates(day_val, month_val, year_val, day, month, year) {
    if (checkDays(day_val, day)) {
        return false;
    } else if (checkMonth30(day_val, month_val, day, month)) {
        return false;
    } else if (checkMonthLeap(day_val, month_val, year_val, day, month)) {
        return false;
    }

    if (checkMonth(month_val, month)) {
        return false;
    }
    if (checkYear(year_val, year)) {
        return false;
    }

    return true;
}

function checkDays(day_val, day) {
    if ((day_val > 31 || day_val < 1) && day_val != "") {
        var message = "This day doesn't exist";

        errorDates(day, null, message);
        return true;
    }
    return false;
}

function checkMonth(month_val, month) {
    if ((month_val > 12 || month_val < 1) && month_val != "") {
        var message = "This is not the time to invent a month :)";

        errorDates(month, null, message);
        return true;
    }
    return false;
}

function checkMonth30(day_val, month_val, day, month) {
    if (
        (month_val == 4 ||
            month_val == 6 ||
            month_val == 9 ||
            month_val == 11) &&
        day_val >= 31 &&
        day_val != "" &&
        month_val != ""
    ) {
        var message = "There's only 30 days in this month!";
        errorDates(day, month, message);
        return true;
    }
    return false;
}

function checkMonthLeap(day_val, month_val, year_val, day, month) {
    if (month_val == 2 && month_val != "") {
        var isleap =
            year_val % 4 == 0 && (year_val % 100 != 0 || year_val % 400 == 0);

        if (day_val > 29 || (day_val == 29 && !isleap)) {
            var message = "There is no such day!";
            errorDates(day, month, message);
            return true;
        }
    }
}

function checkYear(year_val, year) {
    if ((year_val > 2050 || year_val < 1950) && year_val != "") {
        var message = "You're looking a little too far for us here, sorry!";

        errorDates(year, null, message);
        return true;
    }
}

function errorDates(element1, element2, message) {
    errorMessage.text(message);

    if (!isNull(element1) && !isNull(element2)) {
        addAnimationError(element1);
        addAnimationError(element2);
    } else if (!isNull(element1)) {
        addAnimationError(element1);
    }
}

function addAnimationError(element) {
    element.removeClass("validated-dates");
    element.addClass("wrong-shake");
    element.one(
        "webkitAnimationEnd oanimationend msAnimationEnd animationend",
        function(e) {
            element.delay(200).removeClass("wrong-shake");
        }
    );
}

function validatedDates(day_val, month_val, year_val, day, month, year) {
    if (day_val != "" && month_val != "" && year_val != "") {
        day.addClass("validated-dates");
        month.addClass("validated-dates");
        year.addClass("validated-dates");
    }
}

/* =======================================================================

                             Information page

   ======================================================================= */

function sliceText(element, subclass, length) {
    var text = $.trim(element.find(subclass).html());

    var textSliced = text.slice(0, length);
    element.find(subclass).text(textSliced);
}

/* ============================= Weather ================================= */

/* Function to add a separator between days (and their forecast) */
$(function() {
    $(".forecast").each(function() {
        if (document.body.clientWidth <= 768) {
            sliceText($(this), ".forecast-day", 3);
        }

        if (
            $(this).html() !=
            $(".forecast")
                .last()
                .html()
        ) {
            $('<hr class="weather-separator" />').insertAfter($(this));
        }
    });
});

/* ============================= Events ================================== */

var context;
if (document.body.clientWidth <= 768) {
    context = "small";
} else if (
    768 < document.body.clientWidth &&
    document.body.clientWidth <= 992
) {
    context = "medium";
} else if (
    992 < document.body.clientWidth &&
    document.body.clientWidth <= 1200
) {
    context = "large";
} else if (1200 < document.body.clientWidth) {
    context = "extra-large";
}

$(window).bind("resize", function() {
    if (document.body.clientWidth <= 768 && context != "small") {
        /* false to get page from cache */
        this.location.reload(false);
    } else if (
        768 < document.body.clientWidth &&
        document.body.clientWidth <= 992 &&
        context != "medium"
    ) {
        this.location.reload(false);
    } else if (
        992 < document.body.clientWidth &&
        document.body.clientWidth <= 1200 &&
        context != "large"
    ) {
        this.location.reload(false);
    } else if (1200 < document.body.clientWidth && context != "extra-large") {
        this.location.reload(false);
    }
});
/** Function to cut the articles'title if they are too long */
$(function() {
    $(".event").each(function() {
        if (document.body.clientWidth <= 768) {
            eventTitle($(this), 15);
        } else if (document.body.clientWidth > 1200) {
            eventTitle($(this), 20);
        }
    });
});

function eventTitle(element, length) {
    var titreSize = element.find(".event-content-title").text().length;
    var spaceCount =
        element
            .find(".event-content-title")
            .text()
            .split(" ").length - 1;

    sliceText(element, ".event-content-title", length);

    if (titreSize > length + spaceCount) {
        element
            .find(".event-content-title")
            .text(element.find(".event-content-title").text() + "...");
    }
}

/* =======================================================================

                                Login page

   ======================================================================= */
("use strict");
$(".js-1").click(function() {
    $(".signup-holder")
        .fadeIn(600)
        .css({
            display: "flex"
        });
    $(".login-holder").fadeOut(0);
});

("use strict");
$(".js-2").click(function() {
    $(".login-holder").fadeIn(600);
    $(".signup-holder").fadeOut(0);
});

("use strict");

function check(form) {
    if (form.uname.value == "user" && form.psw.value == "123") {
        alert("Welcome User");
    } else {
        alert("The username or password didn't match");
    }
}

function checkBox() {
    if ($("#option").is(":checked")) {
        alert("Thanks for joining us!");
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

        reader.onload = function(e) {
            $("#profileImg").attr("src", e.target.result);
        };

        reader.readAsDataURL(input.files[0]);
    }
}

$("#newImg").change(function() {
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
