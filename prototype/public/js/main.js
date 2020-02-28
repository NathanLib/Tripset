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

var dayFrom = $("#dayFrom");
var monthFrom = $("#monthFrom");
var yearFrom = $("#yearFrom");
var dayTo = $("#dayTo");
var monthTo = $("#monthTo");
var yearTo = $("#yearTo");

var textFrom = $("#dates-text-from");
var textTo = $("#dates-text-to");

var errorMessage = $(".error-message");

function createCalendar() {
    var picker = new Litepicker({
        element: document.getElementById("litepicker"),
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
            dayFrom.html(date1.format("DD"));
            dayFrom.val(date1.format("DD"));
            monthFrom.html(date1.format("MM"));
            monthFrom.val(date1.format("MM"));
            yearFrom.html(date1.format("YYYY"));
            yearFrom.val(date1.format("YYYY"));

            dayTo.html(date2.format("DD"));
            dayTo.val(date2.format("DD"));
            monthTo.html(date2.format("MM"));
            monthTo.val(date2.format("MM"));
            yearTo.html(date2.format("YYYY"));
            yearTo.val(date2.format("YYYY"));
        }
    });
}

function createCalendarWithRange(startDate, endDate) {
    $("#litepicker")
        .children()
        .remove();

    var picker = new Litepicker({
        element: document.getElementById("litepicker"),
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
            dayFrom.html(date1.format("DD"));
            dayFrom.val(date1.format("DD"));
            monthFrom.html(date1.format("MM"));
            monthFrom.val(date1.format("MM"));
            yearFrom.html(date1.format("YYYY"));
            yearFrom.val(date1.format("YYYY"));

            dayTo.html(date2.format("DD"));
            dayTo.val(date2.format("DD"));
            monthTo.html(date2.format("MM"));
            monthTo.val(date2.format("MM"));
            yearTo.html(date2.format("YYYY"));
            yearTo.val(date2.format("YYYY"));
        }
    });
}

function manageCalendar() {
    if ($("#litepicker").is(":empty")) {
        createCalendar();
    } else if (isDatesFromCompleted && isDatesToCompleted) {
        // -1 because month Integer value representing the month, beginning with 0 for January to 11 for December.
        var startDate = new Date(
            yearFrom.val(),
            monthFrom.val() - 1,
            dayFrom.val()
        );
        var endDate = new Date(yearTo.val(), monthTo.val() - 1, dayTo.val());

        createCalendarWithRange(startDate, endDate);
    }
}

function isDatesFromCompleted() {
    if (dayFrom.val() != "" && monthFrom.val() != "" && yearFrom.val() != "") {
        return true;
    } else {
        return false;
    }
}

function isDatesToCompleted() {
    if (dayTo.val() != "" && monthTo.val() != "" && yearTo.val() != "") {
        return true;
    } else {
        return false;
    }
}

function addDates() {
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

function displaySubmit() {
    $("#dates-submit").fadeIn(300, function() {
        $(this).css({
            display: "block"
        });
    });
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

/*
        BIG problem with this function: ask John on Monday
*/

// $(window).bind("resize", function(e) {
//     var context;
//     // run this right away to set context

//     if (document.body.clientWidth <= 768) {
//         context = "small";
//     }
//     if (768 < document.body.clientWidth <= 992) {
//         context = "medium";
//     }
//     if (992 < document.body.clientWidth <= 1200) {
//         context = "large";
//     }
//     if (1200 < document.body.clientWidth) {
//         context = "extra-large";
//     }

//     if (document.body.clientWidth <= 768) {
//         if (context != "small") {
//             //refresh the page
//             console.log("small");

//             /* false to get page from cache */
//             this.location.reload(false);
//         }
//     }
//     if (768 < document.body.clientWidth && document.body.clientWidth <= 992) {
//         if (context != "medium") {
//             console.log("medium");

//             /* false to get page from cache */
//             this.location.reload(false);
//         }
//     }
//     if (992 < document.body.clientWidth && document.body.clientWidth <= 1200) {
//         if (context != "large") {
//             console.log("large");

//             /* false to get page from cache */
//             this.location.reload(false);
//         }
//     }

//     // refresh the page only if you're crossing into a context
//     // that isn't already set
//     // $(window).resize(function() {
//     //     if (1200 < document.body.clientWidth) {
//     //         if (context != "extra-large") {
//     //             console.log("extra");

//     //             location.reload();
//     //         }
//     //     }
//     // });
// });

$(function() {
    $(".event").each(function() {
        if (document.body.clientWidth <= 500) {
            eventTitle($(this), 15);
        } else if (document.body.clientWidth > 1200) {
            eventTitle($(this), 20);
        }
    });
});

function eventTitle(element, length) {
    var titreSize = element.find(".event-content-title").text().length;

    sliceText(element, ".event-content-title", length);

    if (titreSize > length) {
        element
            .find(".event-content-title")
            .text(element.find(".event-content-title").text() + "...");
    }
}
