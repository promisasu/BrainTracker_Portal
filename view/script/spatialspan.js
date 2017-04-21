(function patient () {
    'use strict';

    var allSpatialSpans = Object.create(window.spatialSpans);
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
                            display: true,
                            labelString: 'Activity by Date',
                            fontStyle: "bold"
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
                            display: true,
                            labelString: '% Accuracy',
                            fontStyle: "bold"
                        }
                    }

                ]
            }
        }
    };

    var ctx = document.getElementById('spatialSpanGraph').getContext('2d');
    config.data = allSpatialSpans;

    // instantiating the chart
    new Chart(ctx, config);
}());
