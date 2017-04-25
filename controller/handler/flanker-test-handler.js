/*jslint node: true */
"use strict";

// import modules
const flankerTestService = require('../../service/flanker-test-service');
const utilityService = require('../../service/utility-service');

function flankerTestView(request, reply, patientPin){
    // TODO

    Promise.all([
        utilityService.fetchTrialAndPatientIds(patientPin),
        flankerTestService.fetchAllFlankerTestActivities(patientPin)
    ]).then(function(values){

        var formattedFlankerTests = flankerTestService.fetchFormattedFlankerTests(values[1]);

        return reply.view('flanker-test', {
            title: 'Epilepsy | Flanker Test',
            breadCrumbData: values[0][0],
            flankerTestListData: flankerTestService.fetchFlankerTestActivitiesSelectData(formattedFlankerTests),
            chartData: flankerTestService.fetchAggregateChartData(formattedFlankerTests),
            averageAccuracy: flankerTestService.fetchAverageAccuracy(formattedFlankerTests)
        });
    });

}

module.exports = flankerTestView;