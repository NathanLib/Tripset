/* =======================================================================

                                 General

   ======================================================================= */

const isNull = (value) => typeof value === "object" && !value;

/* ============================= Header ================================== */
function openNav() {
    $('.mobileNav').css({
        width: "50vw"
    });
    $('.mobileNav-background').fadeIn(600, function() {
        $('.mobileNav-background').css({
            display: "block"
        });
    });
}

function closeNav() {
    $('.mobileNav').css({
        width: "0"
    });
    $('.mobileNav-background').fadeOut(600, function() {
        $('.mobileNav-background').css({
            display: "none"
        });
    });
}

/* =======================================================================

                                Home page

   ======================================================================= */

/* ================== Searchbar - Dates details ======================= */

var dayFrom = $('#dayFrom');
var monthFrom = $('#monthFrom');
var yearFrom = $('#yearFrom');
var dayTo = $('#dayTo');
var monthTo = $('#monthTo');
var yearTo = $('#yearTo');

var textFrom = $('#dates-text-from');
var textTo = $('#dates-text-to');

var errorMessage = $('.error-message');

function createCalendar() {
    var picker = new Litepicker({
        element: document.getElementById('litepicker'),
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
            dayFrom.html(date1.format('DD'));
            dayFrom.val(date1.format('DD'));
            monthFrom.html(date1.format('MM'));
            monthFrom.val(date1.format('MM'));
            yearFrom.html(date1.format('YYYY'));
            yearFrom.val(date1.format('YYYY'));

            dayTo.html(date2.format('DD'));
            dayTo.val(date2.format('DD'));
            monthTo.html(date2.format('MM'));
            monthTo.val(date2.format('MM'));
            yearTo.html(date2.format('YYYY'));
            yearTo.val(date2.format('YYYY'));
        }
    });
}

function createCalendarWithRange(startDate, endDate) {
    $("#litepicker").children().remove();

    var picker = new Litepicker({
        element: document.getElementById('litepicker'),
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
            dayFrom.html(date1.format('DD'));
            dayFrom.val(date1.format('DD'));
            monthFrom.html(date1.format('MM'));
            monthFrom.val(date1.format('MM'));
            yearFrom.html(date1.format('YYYY'));
            yearFrom.val(date1.format('YYYY'));

            dayTo.html(date2.format('DD'));
            dayTo.val(date2.format('DD'));
            monthTo.html(date2.format('MM'));
            monthTo.val(date2.format('MM'));
            yearTo.html(date2.format('YYYY'));
            yearTo.val(date2.format('YYYY'));
        }
    });
}

function manageCalendar() {
    if ($('#litepicker').is(':empty')) {
        createCalendar();
    } else if (isDatesFromCompleted && isDatesToCompleted) {
        // -1 because month Integer value representing the month, beginning with 0 for January to 11 for December.
        var startDate = new Date(yearFrom.val(), monthFrom.val() - 1, dayFrom.val());
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
    $.when(
        manageCalendar()
    ).done(function() {
        if (document.body.clientWidth <= 992) {
            if ($('.dates-details').css('display') == 'none') {
                $('.searchbar-container').animate({
                    marginTop: '1rem'
                }, 700);
            } else {
                $('.searchbar-container').animate({
                    marginTop: '10rem'
                }, 700);
            }
        } else if (document.body.clientWidth <= 1200) {
            if ($('.dates-details').css('display') == 'none') {
                $('.searchbar-container').animate({
                    marginTop: '3.5rem'
                }, 700);
            } else {
                $('.searchbar-container').animate({
                    marginTop: '10rem'
                }, 700);
            }
        }

        $('.dates-details').slideToggle(700);
    });
}

function displaySubmit() {
    $('#dates-submit').fadeIn(300, function() {
        $(this).css({
            display: 'block'
        });
    });
}

function datesValidation() {

    var message = "";

    var dayFrom_val = dayFrom.val();
    var monthFrom_val = monthFrom.val();
    var yearFrom_val = yearFrom.val();

    var dayTo_val = dayTo.val();
    var monthTo_val = monthTo.val();
    var yearTo_val = yearTo.val();

    if ((dayFrom_val > 31 || dayFrom_val < 1) && dayFrom_val != "") {

        message = 'This day doesn\'t exist';
        errorDates(dayFrom, null, message);
        return false;

    } else if ((monthFrom_val == 4
            || monthFrom_val == 6
            || monthFrom_val == 9
            || monthFrom_val == 11)
            && dayFrom_val >= 31
            && dayFrom_val != ""
            && monthFrom_val != "") {

        message = 'There\'s only 30 days in this month!';
        errorDates(dayFrom, monthFrom, message);
        return false;

    } else if (monthFrom_val == 2 && monthFrom_val != "") {
        var isleap = (yearFrom_val % 4 == 0
                && (yearFrom_val % 100 != 0
                || yearFrom_val % 400 == 0));

        if (dayFrom_val > 29 || (dayFrom_val == 29 && !isleap)) {
            message = 'There is no such day!';
            errorDates(dayFrom, null, message);
            return false;
        }
    }
    if ((monthFrom_val > 12 || monthFrom_val < 1) && monthFrom_val != "") {
        message = 'This is not the time to invent a month :)';
        errorDates(monthFrom, null, message);
        return false;
    }
    if ((yearFrom_val > 2050 || yearFrom_val < 1950) && yearFrom_val != "") {
        message = 'You\'re looking a little too far for us here, sorru!';
        errorDates(yearFrom, null, message);
        return false;
    }

    errorMessage.text("");
    return true;
}

function errorDates(element1, element2, message) {
    errorMessage.text(message);

    if (!isNull(element1) && !isNull(element2)) {
        element1.addClass('wrong-shake');
        element1.one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(e) {
            element1.delay(200).removeClass('wrong-shake');
        });

        element2.addClass('wrong-shake');
        element2.one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(e) {
            element2.delay(200).removeClass('wrong-shake');
        });
    } else if (!isNull(element1)) {
        element1.addClass('wrong-shake');
        element1.one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(e) {
            element1.delay(200).removeClass('wrong-shake');
        });
    }
}
