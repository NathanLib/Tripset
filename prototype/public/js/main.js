/* =======================================================================

                                 General

   ======================================================================= */

/* ============================= Header ================================== */
function openNav() {
    $('.mobileNav').css({
        width: "50vw"
    });
    $('body').toggleClass("backgroundColor--dark");
}

function closeNav() {
    $('.mobileNav').css({
        width: "0"
    });
    $('body').toggleClass("backgroundColor--light");
    $('body').removeClass("backgroundColor--dark");
    setTimeout(function() {
        $('body').removeClass("backgroundColor--light");
    }, 500);
}
