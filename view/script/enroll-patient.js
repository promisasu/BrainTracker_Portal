(function enrollPatient () {
    'use strict';

    // TODO -- change the implementation of form submission for ajax
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
                if (!moment.utc(startDate).isBefore(moment.utc(), 'day')) {

                    // ajax post request
                    var posting = $.post(url, $( "#enrollPatientForm" ).serialize());

                    posting.done(function(data){
                        console.log(data);
                        console.log('done');
                    });

                    posting.fail(function(err){
                        showErrorMessage(err.responseJSON.message);
                    });


                } else {
                    showErrorMessage('Start Date must be a minimum of today!');
                }
            } else {
                showErrorMessage('Invalid Start Date!');
            }
        } else {
            showErrorMessage('Invalid Patient Pin!');
        }
    });

    setTimeout(function() {
        console.log('in timeout call');
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
}());


