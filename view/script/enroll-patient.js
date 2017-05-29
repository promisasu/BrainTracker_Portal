(function enrollPatient () {
    'use strict';

    $("#enrollPatientForm").submit(function (event) {
        // stop from submitting normally
        event.preventDefault();

        var $form = $(this);
        var url = $form.attr('action');

        var patientPin = $('#patientPin').val();
        var startDate = $('#startDate').val();
        var trialId = $('#trialId').val();

        if (patientPin !== '') {
            if (moment(startDate).isValid()) {

                // adding time to startDate
                startDate += " 00:00:00";

                var currentDate = moment();
                var startDateObject = moment(new Date(startDate));
                var startDateCheck = startDateObject.isBefore(currentDate, 'day');

                if (!startDateCheck) {

                    // ajax post request
                    var posting = $.post(url, {patientPin: patientPin, startDate: new Date(startDate), trialId: trialId});

                    posting.done(function(data){
                        console.log(data);
                        console.log('done');

                        hideErrorMessage();
                        showSuccessMessage(data.message);
                    });

                    posting.fail(function(err){
                        hideSuccessMessage();
                        showErrorMessage(err.responseJSON.message);
                    });

                } else {
                    hideSuccessMessage();
                    showErrorMessage('Start Date must be a minimum of today!');
                }
            } else {
                hideSuccessMessage();
                showErrorMessage('Invalid Start Date!');
            }
        } else {
            hideSuccessMessage();
            showErrorMessage('Invalid Patient Pin!');
        }
    });

    setTimeout(function() {
        hideSuccessMessage();
        hideErrorMessage();
    }, 5000);

    function showErrorMessage(message){
        $('#error-message-div').removeClass('hide');
        $('#error-message-div').addClass('show');
        $('#error-message').html(message);
    }

    function hideErrorMessage(){
        $('#error-message-div').removeClass('show');
        $('#error-message-div').addClass('hide');
    };

    function showSuccessMessage(message){
        $('#success-message-div').removeClass('hide');
        $('#success-message-div').addClass('show');
        $('#success-message').html(message);
    }

    function hideSuccessMessage(){
        $('#success-message-div').removeClass('show');
        $('#success-message-div').addClass('hide');
    }
}());


