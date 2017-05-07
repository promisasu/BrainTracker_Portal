(function patient () {
    'use strict';

    var isNewPatient = window.location.search;
    var isNewPatientRegex = /newPatient=true/;

    // Makes a copy of window.dates
    var allDatesConfig = Object.create(window.dates);
    var allClinicalValues = Object.create(window.clinicalValues);
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
                            show: true,
                            labelString: '% Time Left'
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
                            show: true,
                            labelString: '% Time Left'
                        }
                    }
                ]
            }
        }
    };

   // var ctx = document.getElementById('complianceChartSummary').getContext('2d');
    var surveyContext = document.getElementById('surveyComplianceChart').getContext('2d');
    var scoresContext = document.getElementById('scoresComplianceChart').getContext('2d');

    var clinicalChartConfig = {
        type: 'line',
        options: {
            scales: {
                yAxes: [{
                    stacked: false,
                    display: false
                }]
            }
        }
    };
    function redirect () {
        window.location = '/';
    }

    function warningMessage () {
        alert('patient could not be deactivated');
    }



    if (isNewPatientRegex.test(isNewPatient)) {
        $('#remember-patient-dialog').modal('show');
    }

   // config.data = allDatesConfig;
    config.data = allsummaryValues;
    new Chart(surveyContext, config);

    clinicalChartConfig.data = allClinicalValues;
    new Chart(scoresContext, clinicalChartConfig);
})();
