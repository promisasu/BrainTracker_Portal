(function patient () {
    'use strict';

    var compliances = Object.create(window.complianceChartData);
    var config = {
        type: 'bar',
        data: {},
        options: {
            animation: {
                duration: 10
            },
            tooltips: {
                mode: 'label',
                callbacks: {
                    label: function(tooltipItem, data){
                        return data.datasets[tooltipItem.datasetIndex].label + ": " + tooltipItem.yLabel + "%";
                    }
                }
            },
            scales:{
                xAxes: [
                    {

                        stacked: true,
                        gridLines: { display: false },
                        scaleLabel: {
                            display: true,
                            labelString: 'Activities By Week',
                            fontStyle: 'bold'
                        }
                    }
                ],
                yAxes: [
                    {
                        stacked: true,
                        position: 'left',
                        ticks: {
                            max: 100,
                            min: 0
                        },
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: '% Complied',
                            fontStyle: "bold"
                        }
                    }
                ]
            },
            legend: {display:true}
        }
    };

    var complianceChartCanvas = document.getElementById('complianceGraph').getContext('2d');

    config.data = compliances;
    new Chart(complianceChartCanvas, config);


})();
