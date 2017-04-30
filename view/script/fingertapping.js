(function patient () {
    'use strict';

    var allTaps = Object.create(window.taps);
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

    var ctx = document.getElementById('fingerTapping').getContext('2d');
    config.data = allTaps;

    // instantiating the chart
    new Chart(ctx, config);
}());
