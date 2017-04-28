(function patient () {
    'use strict';

    var allPatternComparisons = Object.create(window.patternComparisons);
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

    var ctx = document.getElementById('patternComparisonGraph').getContext('2d');
    config.data = {
        labels : ['03052017 1501','03062017 1701','03072017 1501',
            '03082017 1501','03092017 1501'],
        datasets : [
            {
                label: '% Accuracy of the Pattern Comparision test',
                fillColor : "rgba(252,233,79,0.5)",
                strokeColor : "rgba(82,75,25,1)",
                pointColor : "rgba(166,152,51,1)",
                pointStrokeColor : "#fff",
                data : [65,68,75,
                    81,95]
            }
        ]
    };

    new Chart(ctx, config);
}());
