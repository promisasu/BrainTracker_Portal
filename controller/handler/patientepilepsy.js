'use strict';

/**
 * @module controller/handler/patient
 */

const database = require('../../model');
const processSurveyInstances = require('../helper/process-survey-instances');
const spatialSpanService = require('../../service/spatial-span-service');
const fingerTappingService = require('../../service/finger-tapping-service');
const flankerTestService = require('../../service/flanker-test-service');
const patternComparisonService = require('../../service/pattern-comparison-service');
const surveySummaryChartService = require('../../service/survey-service');
const utilityService = require('../../service/utility-service');
const scoreService = require('../../service/score-service');
const moment = require('moment');
const sqlDateFormat = 'ddd MMM DD YYYY HH:mm:ss ZZ';
const httpNotFound = 404;

/**
 * A dashboard with an overview of a specific patient.
 * @param {Request} request - Hapi request
 * @param {Reply} reply - Hapi Reply
 * @returns {View} Rendered page
 */
function patientView (request, reply) {
var tapsReturn ={};
    Promise
        .all([ utilityService.fetchPatientIds(request.params.pin),
            surveySummaryChartService.fetchSurveyInstance(request.params.pin),
            utilityService.fetchTrialsIds(request.params.pin),
            fingerTappingService.fetchFiveFingerTapping(request.params.pin),
            spatialSpanService.fetchRecentFiveActivities(request.params.pin),
            flankerTestService.fetchRecentFiveActivities(request.params.pin),
            patternComparisonService.fetchRecentFivePatternComparisons(request.params.pin),
            scoreService.fetchSurveyResults(request.params.pin),
            scoreService.fetchopioidResults(request.params.pin),
            scoreService.fetchbodypainResults(request.params.pin),
            surveySummaryChartService.fetchFingerTappingCompliance(request.params.pin),
            surveySummaryChartService.fetchPatternComparisonCompliance(request.params.pin),
            surveySummaryChartService.fetchFlankerCompliance(request.params.pin),
            surveySummaryChartService.fetchSpatialSpanCompliance(request.params.pin)
           ])
        .then(([currentPatient, surveyInstances, currentTrial,fingerTappings,spatialSpan, flankerTests, patternComparisons,surveyResults,opioidResults,bodyPainResults,fingerTappingCompliance,patternComparisonCompliance,flankerCompliance,spatialspanCompliance]) => {
            // patient not found
        if (!currentPatient) {
                throw new Error('patient does not exist');
            }
    let clinicalValuesChart = processSurveyInstances.processClinicanData(
        surveyInstances, surveyResults, bodyPainResults, opioidResults
    );
            var summarySurveyDataSets =[];
            var summaryChartData =[];

          /*
           * Get Chart Parameters of recent five attempts of following activities .
           */

            var formattedSpatialSpanResult = spatialSpanService.fetchFormattedSpatialSpanActivities(spatialSpan);
            var formattedfingerTapping = fingerTappingService.fetchFormattedFingerTapping(fingerTappings);
            var formattedFlankerTests = flankerTestService.fetchFormattedFlankerTests(flankerTests);
            var formattedPatternComparisons = patternComparisonService.fetchFormattedPatternComparisons(patternComparisons);
            /*
            * Format DateTime and Compliance.
            * Get the Parameters to Display on Chart
            * Push to DataSets array where all the chart details are present
            */

            //finger tapping
            var formattedFingerTappingCompliance = surveySummaryChartService.fetchFormattedResults(fingerTappingCompliance);
            var fingerTappingChartParams = surveySummaryChartService.fetchChartParamsForActivity(formattedFingerTappingCompliance);
            summarySurveyDataSets.push(fingerTappingChartParams);

            //pattern compliance
            var formattedPatternComparisonCompliance = surveySummaryChartService.fetchFormattedResults(patternComparisonCompliance);
            var patternComparisonChartParams = surveySummaryChartService.fetchChartParamsForActivity(formattedPatternComparisonCompliance);
            summarySurveyDataSets.push(patternComparisonChartParams);

            //flanker
            var formattedFlankerCompliance = surveySummaryChartService.fetchFormattedResults(flankerCompliance);
            var flankerChartParams =  surveySummaryChartService.fetchChartParamsForActivity(formattedFlankerCompliance);
            summarySurveyDataSets.push(flankerChartParams);

            //spatial span
            var formattedSpatialSpanCompliance =  surveySummaryChartService.fetchFormattedResults(spatialspanCompliance);
            var spatialSpanChartParams = surveySummaryChartService.fetchChartParamsForActivity(formattedSpatialSpanCompliance);
            summarySurveyDataSets.push(spatialSpanChartParams);

            //Daily and Weekly Surveys
            var surveyChartParams = processSurveyInstances.fetchSurveySummary(surveyInstances);
            summaryChartData = surveySummaryChartService.fetchSurveyDataSets(summarySurveyDataSets);
            summaryChartData.push.apply(summaryChartData, surveyChartParams);

            return reply.view('patientepilepsy', {
                title: 'Epilepsy | Patient',
                patient: currentPatient[0],
                trial: currentTrial[0],
                datesJson: JSON.stringify(processSurveyInstances(surveyInstances)),
                tapsJson : fingerTappingService.fetchFingerTappingChartData(formattedfingerTapping),
                spatialJson : spatialSpanService.fetchSpatialSpanChartData(formattedSpatialSpanResult),
                flankerTests: flankerTestService.fetchAggregateChartData(formattedFlankerTests),
                patternComparisons: patternComparisonService.fetchAggregateChartData(formattedPatternComparisons),
                clinicalValues: JSON.stringify(clinicalValuesChart),
                surveySummaryChart: surveySummaryChartService.fetchSurveySummaryChart(summaryChartData)
            });

        })
        .catch((err) => {
            request.log('error', err);

            reply
            .view('404', {
                title: 'Not Found from Dashboard'
            })
            .code(httpNotFound);
        });
}

module.exports = patientView;
