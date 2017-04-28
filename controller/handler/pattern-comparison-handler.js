'use strict';

// import modules;
const patternComparisonService = require('../../service/pattern-comparison-service');
const utilityService = require('../../service/utility-service');

/**
 * @module controller/handler/pattern-comparison-handler
 */

/**
 * A pattern comparison view with overview of all the pattern comparison tests.
 * @param {Request} request - Hapi request
 * @param {Reply} reply - Hapi Reply
 * @returns {View} Rendered page
 */
function patternComparisonView(request, reply, patientPin){
    Promise.all([
        utilityService.fetchTrialAndPatientIds(patientPin),
        patternComparisonService.fetchAllPatternComparisons(patientPin)
    ]).then(function(values){

        var formattedPatternComparisons = patternComparisonService.fetchFormattedPatternComparisons(values[1]);

        return reply.view('pattern-comparison', {
            title: 'Epilepsy | Pattern Comparison',
            breadCrumbData: values[0][0],
            averageAccuracy: patternComparisonService.fetchAverageAccuracy(formattedPatternComparisons),
            chartData: patternComparisonService.fetchAggregateChartData(formattedPatternComparisons)
        });

    }).catch(function(err){
        console.log(err);
        return reply({code: 500, message: 'Something went Wrong!'}).code(500);
    });
}

module.exports = patternComparisonView;
