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
    config.data = allPatternComparisons;

    new Chart(ctx, config);
}());
