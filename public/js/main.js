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
            display:"block"
        });
    });
}

function closeNav() {
    $('.mobileNav').css({
        width: "0"
    });
    $('.mobileNav-background').fadeOut(600, function() {
        $('.mobileNav-background').css({
            display:"none"
        });
    });
}
/* ============================= Login ================================== */
'use strict';
	$('.js-1').click(function(){
		$('.signup-holder').fadeIn(600).css({
            display:"flex"
        });$('.login-holder').fadeOut(0);
		
	});

'use strict';
$('.js-2').click(function(){
	$('.login-holder').fadeIn(600);$('.signup-holder').fadeOut(0);
});	


'use strict';
	
	
	function check(form)
		{
			if(form.uname.value == "user" && form.psw.value == "123")
				{
					alert("Welcome User")
					
					
				}
			else{
				alert("The username or password didn't match")
			}
		}

function checkBox()
		{
			if($('#option').is(':checked'))
				{
					alert("Thanks for joining us!")
					$('.signup-holder').fadeOut(0);$('.login-holder').fadeIn(600);
					
				}
			else{
				alert("You didn't agree to our terms :(")
			}
		}


	