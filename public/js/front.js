$(document).ready(function() {

    /*$('.form').find('input, textarea').on('keyup blur focus change', function(e) {

        var $this = $(this),
            label = $this.prev('label');

        if (e.type === 'keyup') {
            if ($this.val() === '') {
                label.removeClass('active highlight');
            } else {
                label.addClass('active highlight');
            }

            if (uservalue === '') {
                user_label.text("Username");
                user_label.removeClass('error');
            }

            if (emailvalue === '') {
                email_label.text("Email Address");
                email_label.removeClass('error');
            }

            if (userfieldvalue === '') {
                userfield_label.text("Username");
                userfield_label.removeClass('error');
            }

            if (passfieldvalue === '') {
                passfield_label.text("Password");
                passfield_label.removeClass('error');
            }

        } else if (e.type === 'blur') {
            if ($this.val() === '') {
                label.removeClass('active highlight');
            } else {
                label.removeClass('highlight');
            }
        } else if (e.type === 'change') {
            if ($this.val() === '') {
                label.removeClass('active highlight');
            } else {
                label.removeClass('highlight');
            }
        } else if (e.type === 'focus') {

            if ($this.val() === '') {
                label.removeClass('highlight');
            } else if ($this.val() !== '') {
                label.addClass('highlight');
            }
        }

    });

    $('.tab a').on('click', function(e) {

        e.preventDefault();

        $(this).parent().addClass('active');
        $(this).parent().siblings().removeClass('active');

        target = $(this).attr('href');

        $('.tab-content > div').not(target).hide();

        $(target).fadeIn(400);

    });*/

    //Each input field under the Login tab
    //var userfield = $("#username")[0];
    //var passfield = $("#password")[0];

    //Each input field under the Sign Up tab
    var user = $("#new_username")[0];
    var email = $("#new_email")[0];
    var pass1 = $("#new_password")[0];
    var pass2 = $("#confirm_password")[0];

    //HTML labels
    var user_label = $("label[for='new_username']");
    var email_label = $("label[for='new_email']");
    //var userfield_label = $("label[for='username']");
    //var passfield_label = $("label[for='password']");

    //Actual input value of login/sign-up fields
    var uservalue = user.value;
    var emailvalue = email.value;
    //var userfieldvalue = userfield.value;
    //var passfieldvalue = passfield.value;

    //Username and password validation
    pass1.onchange = validatePassword;
    pass2.onchange = validatePassword;
    user.onchange = validateUsername;

    function validatePassword() {

        var pass1_value = pass1.value;
        var pass2_value = pass2.value;

        if (pass1_value != pass2_value) {
            pass2.setCustomValidity("Passwords do not match");
        } else {
            pass2.setCustomValidity("");
        }

        if (pass1.validity.patternMismatch) {
            pass1.setCustomValidity("Password must contain at least 6 characters, including UPPER/lowercase and numbers")
        } else {
            pass1.setCustomValidity("");
        }
    }

    function validateUsername() {

        if (user.validity.rangeOverflow) {
            user.setCustomValidity("Username is too long");
        }

        else if (user.validity.patternMismatch) {
            user.setCustomValidity("Username must not be blank and contain only letters or numbers");
        } 

        else {
            user.setCustomValidity("");
        }
    }

    /*$('#signup_form').submit(function(e) {
        $.ajax({
            type: 'POST',
            url: 'signup.php',
            data: $(this).serialize(),
            dataType : 'json',
            encode : true
        })
        
            .done(function(data) {

                if (!data.success) {
                    if (data.errors.new_username) {
                        user_label.addClass('error');
                        user_label.text(data.errors.new_username);
                    }

                    if (data.errors.new_email) {
                        email_label.addClass('error');
                        email_label.text(data.errors.new_email);
                    }
                }

                else {
                    $("#signup_form").fadeOut(400);
                    $("#created").fadeIn(400);
                    $("#sign").fadeOut(400);
                    $('.tab-group').fadeOut(400);
                }
            });
        e.preventDefault();
    });

$('#login_form').submit(function(e) {

    $.ajax({
        type: 'POST',
        url: 'login.php',
        data: $(this).serialize(),
        dataType : 'json',
        encode : true
    })
    
        .done(function(data) {

            if (data.success) {
                window.location = "member_area.php";
            }

            else {
                if (data.errors.username) {
                    userfield_label.addClass('error');
                    userfield_label.text(data.errors.username);
                }

                if (data.errors.password) {
                    passfield_label.addClass('error');
                    passfield_label.text(data.errors.password);
                }
            }
        });
        e.preventDefault();
    });*/

});