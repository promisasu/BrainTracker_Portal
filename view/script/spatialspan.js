(function patient () {
    'use strict';

    var allSpatialSpans = Object.create(window.spatialSpans);
    var config = {
        type: 'bar',
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
                        },
                        id : "y-axis-1"
                    },
                    {

                        type: 'linear',
                        position: 'right',
                        ticks: {
                            max: 10,
                            min: 0
                        },
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Max Level',
                            fontStyle: "bold"
                        },
                        id : "y-axis-2"
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