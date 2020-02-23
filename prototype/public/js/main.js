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
    } else if (dayFrom.val() != "" && monthFrom.val() != "" && yearFrom.val() != "" &&
        dayTo.val() != "" && monthTo.val() != "" && yearTo.val() != "") {

        // -1 because month Integer value representing the month, beginning with 0 for January to 11 for December.
        var startDate = new Date(yearFrom.val(), monthFrom.val() - 1, dayFrom.val());
        var endDate = new Date(yearTo.val(), monthTo.val() - 1, dayTo.val());

        createCalendarWithRange(startDate, endDate);
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
    $('#submit').click(function() {
        var date = parseInt($('#date').val());
        var month = parseInt($('#month').val());
        var year = parseInt($('#year').val());
        if (isNaN(date) || isNaN(month) || isNaN(year)) {
            alert('wrong format');
            return false;
        } else {
            if (date > 31 || date < 1) {
                alert('wrong date');
                return false;
            } else if ((month == 4 || month == 6 || month == 9 || month == 11) && date == 31) {
                alert('wrong date');
                return false;
            } else if (month == 2) {
                var isleap = (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0));
                if (date > 29 || (date == 29 && !isleap))
                    alert('wrong date');
                return false;
            }
            if (month > 12 || month < 1) {
                alert('wrong month');
                return false;
            }
            if (year > 2050 || year < 1900) {
                alert('wrong year');
                return false;
            }
        }
        $('#myform').submit();
    });
}
