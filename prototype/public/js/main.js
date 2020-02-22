/* =======================================================================

                                 General

   ======================================================================= */

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

function addDates() {
    var startDate = new Date();
    var numberOfColumns = 1;
    var width = document.body.clientWidth;

    var dayFrom = $('#dayFrom');
    var monthFrom = $('#monthFrom');
    var yearFrom = $('#yearFrom');
    var dayTo = $('#dayTo');
    var monthTo = $('#monthTo');
    var yearTo = $('#yearTo');

    $('.dates-details').slideToggle(700);

    if (width >= 992) {
        numberOfColumns = 2;
    }

    if ($('#litepicker').is(':empty')) {
        var picker = new Litepicker({
            element: document.getElementById('litepicker'),
            singleMode: false,
            allowRepick: true,
            inlineMode: true,
            numberOfMonths: 2,
            numberOfColumns: numberOfColumns,
            startDate: startDate,
            minDate: startDate,
            autoApply: true,
            showWeekNumbers: true,
            mobileFriendly: true,
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
}

function datesValidation() {}

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
