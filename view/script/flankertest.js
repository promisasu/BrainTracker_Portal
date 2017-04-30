(function patient () {
    'use strict';

    var allFlankerTests = Object.create(window.flankerTests);
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

    var ctx = document.getElementById('flankerTestGraph').getContext('2d');
    config.data = allFlankerTests;

    new Chart(ctx, config);
}());
