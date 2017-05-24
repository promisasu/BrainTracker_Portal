'use strict';

/**
 * @module controller/handler/patient
 */

// import modules
const complianceService = require('../../service/compliance-service');
const utilityService = require('../../service/utility-service');
const patternComparisonService = require('../../service/pattern-comparison-service');
const fingerTappingService = require('../../service/finger-tapping-service');
const spatialSpanService = require('../../service/spatial-span-service');
const flankerTestService = require('../../service/flanker-test-service');

/**
 * A dashboard with an overview of a specific patient.
 * @param {Request} request - Hapi request
 * @param {Reply} reply - Hapi Reply
 * @returns {View} Rendered page
 */
function patientView (request, reply) {

    Promise.all([
        utilityService.fetchTrialAndPatientIds(request.params.pin),
        complianceService.fetchPatientComplianceData(request.params.pin),
        patternComparisonService.fetchRecentFivePatternComparisons(request.params.pin),
        fingerTappingService.fetchRecentFiveFingerTappings(request.params.pin),
        spatialSpanService.fetchRecentFiveSpatialSpans(request.params.pin),
        flankerTestService.fetchRecentFiveFlankerTests(request.params.pin)
    ]).then(function(values){

        var formattedPatternComparisons = patternComparisonService.fetchFormattedPatternComparisons(values[2]);
        var formattedFingerTappings = fingerTappingService.fetchFormattedFingerTapping(values[3]);
        var formattedSpatialSpans = spatialSpanService.fetchFormattedSpatialSpanActivities(values[4]);
        var formattedFlankerTests = spatialSpanService.fetchFormattedSpatialSpanActivities(values[5]);


        return reply.view('patientepilepsy', {
            title: 'Epilepsy | Patient',
            breadCrumbData: values[0][0],
            complianceChartData: JSON.stringify(complianceService.fetchComplianceChartData(values[1])),
            patternComparisonChartData: patternComparisonService.fetchAggregateChartData(formattedPatternComparisons),
            fingerTappingChartData: fingerTappingService.fetchFingerTappingChartData(formattedFingerTappings),
            spatialSpanChartData: spatialSpanService.fetchSpatialSpanChartData(formattedSpatialSpans),
            flankerTestChartData: flankerTestService.fetchAggregateChartData(formattedFlankerTests)
        });
    }).catch(function(err){
        console.log(err);
        return reply({code: 500, message: 'Something went Wrong!'}).code(500);
    });
}

module.exports = patientView;
