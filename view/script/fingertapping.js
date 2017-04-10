(function patient () {
    'use strict';

    var isNewPatient = window.location.search;
    var isNewPatientRegex = /newPatient=true/;

    // Makes a copy of window.dates
    var allDatesConfig = Object.create(window.dates);
    var config = {
        type: 'line',
        data: '',
        options: {
            scales: {
                xAxes: [
                    {
                        type: 'time',
                        display: true,
                        time: {
                            format: 'MM-DD-YYYY HHmm',
                            unit: 'day',
                            round: 'day'
                        },
                        scaleLabel: {
                            show: true,
                            labelString: ''
                        }
                    }
                ],
                yAxes: [
                    {
                        
                        type: 'linear',
                        position: 'left',
                        ticks: {
                            max: 100,
                            min: 0
                        },
                        display: true,
                        scaleLabel: {
                            show: true,
                            labelString: '% Accuracy'
                        }
                    }

                ]
            }
        }
    };

    var ctx = document.getElementById('fingerTapping').getContext('2d');

    function redirect () {
        window.location = '/';
    }

    function warningMessage () {
        alert('patient could not be deactivated');
    }

    /*document.getElementById('viewdetail')
    .addEventListener('click', function deactivate () {
        $.ajax({
            url: window.location.pathname,
            type: 'DELETE'
        })
        .done(redirect)
        .fail(warningMessage);
    });*/

    if (isNewPatientRegex.test(isNewPatient)) {
        $('#remember-patient-dialog').modal('show');
    }

    config.data =  {
        labels : ['03052017 1501','03062017 1701','03072017 1501',
            '03082017 1501','03092017 1501'],
        datasets : [
            {
                label: 'Right',
                backgroundColor : "rgba(44, 62, 80,0.5)",
                data : [65,68,75,
                    81,95]
            },
            {
                label: 'Left',
                backgroundColor : "rgba(231, 76, 60,0.5)",
                data : [20,14,36,
                    72,34]
            }
        ]
    };
    new Chart(ctx, config);
}());
