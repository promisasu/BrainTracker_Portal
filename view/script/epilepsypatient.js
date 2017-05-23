(function patient () {
    'use strict';

    var isNewPatient = window.location.search;
    var isNewPatientRegex = /newPatient=true/;

    // Makes a copy of window.dates
    var allDatesConfig = Object.create(window.dates);
    var allsummaryValues = Object.create(window.surveysummary);
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
                            format: 'MMDDYYYY HHmm',
                            unit: 'week',
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
                        id: 'y-axis-0',
                        type: 'linear',
                        position: 'left',
                        ticks: {
                            max: 100,
                            min: 0
                        },
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: '% Time left till this Activity expires',
                            fontStyle: "bold"
                        }
                    },
                    {
                        id: 'y-axis-1',
                        type: 'linear',
                        position: 'right',
                        ticks: {
                            max: 100,
                            min: 0
                        },
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: '% Time left till this Activity expires',
                            fontStyle: "bold"
                        }
                    }
                ]
            }
        }
    };

   // var ctx = document.getElementById('complianceChartSummary').getContext('2d');
    var surveyContext = document.getElementById('surveyComplianceChart').getContext('2d');

    function redirect () {
        window.location = '/';
    }

    function warningMessage () {
        alert('patient could not be deactivated');
    }



    if (isNewPatientRegex.test(isNewPatient)) {
        $('#remember-patient-dialog').modal('show');
    }

    config.data = allsummaryValues;
    new Chart(surveyContext, config);


})();
