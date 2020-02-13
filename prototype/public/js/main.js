/* =======================================================================

                                 General

   ======================================================================= */

/* ============================= Header ================================== */
function openNav() {
    $('.mobileNav').css({width: "50vw"});
    $('body').toggleClass("backgroundColor--dark");
    $('body').removeClass("backgroundColor--light");
}

function closeNav() {
    $('.mobileNav').css({width: "0"});
    $('body').toggleClass("backgroundColor--light");
    $('body').removeClass("backgroundColor--dark");
}
