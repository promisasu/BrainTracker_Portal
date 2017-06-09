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

    // fetch patient record
    utilityService.fetchPatientRecord(request.params.pin).then(function(patient){

        // fetch parent's activities for this child patient
        complianceService.fetchParentActivities(patient[0].ParentPinFK).then(function(parentActivities){

            // fetch child's activities
            complianceService.fetchChildActivities(patient[0].PatientPin).then(function(childActivities){

                // fetch breadCrumb Data
                utilityService.fetchTrialAndPatientIds(request.params.pin).then(function(breadCrumbData){

                    // fetch latest five pattern-comparisons
                    patternComparisonService.fetchRecentFivePatternComparisons(request.params.pin).then(function(patternComparisons){

                        // fetch latest five finger-taps
                        fingerTappingService.fetchRecentFiveFingerTappings(request.params.pin).then(function(fingerTaps){

                            // fetch latest five spatial-spans
                            spatialSpanService.fetchRecentFiveSpatialSpans(request.params.pin).then(function(spatialSpans){

                                // fetch latest five flanker-tests
                                flankerTestService.fetchRecentFiveFlankerTests(request.params.pin).then(function(flankerTests){

                                    var formattedPatternComparisons = patternComparisonService.fetchFormattedPatternComparisons(patternComparisons);
                                    var formattedFingerTaps = fingerTappingService.fetchFormattedFingerTapping(fingerTaps);
                                    var formattedSpatialSpans = spatialSpanService.fetchFormattedSpatialSpanActivities(spatialSpans);
                                    var formattedFlankerTests = flankerTestService.fetchFormattedFlankerTests(flankerTests);

                                    return reply.view('patientepilepsy', {
                                        title: 'Epilepsy | Patient',
                                        breadCrumbData: breadCrumbData[0],
                                        complianceChartData: JSON.stringify(complianceService.fetchComplianceChartData(childActivities.concat(parentActivities))),
                                        patternComparisonChartData: patternComparisonService.fetchAggregateChartData(formattedPatternComparisons),
                                        fingerTappingChartData: fingerTappingService.fetchFingerTappingChartData(formattedFingerTaps),
                                        spatialSpanChartData: spatialSpanService.fetchSpatialSpanChartData(formattedSpatialSpans),
                                        flankerTestChartData: flankerTestService.fetchAggregateChartData(formattedFlankerTests)
                                    });

                                });
                            });
                        });
                    })
                });
            });
        });


    }).catch(function(err){
        console.log(err);
        return reply({code: 500, message: 'Something went Wrong!'}).code(500);
    });
}

module.exports = patientView;
