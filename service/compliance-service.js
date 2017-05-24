/*jslint node: true */
'use strict';

// import modules
const database = require('../model');
const moment = require('moment');
const viewDateTimeFormat = "MM/DD/YYYY hh:mm";
const utilityService = require('./utility-service');

// captions
const PATTERN_COMPARISON = 'Pattern-Comparison';
const FINGER_TAPPING = 'Finger-Tapping';
const SPATIAL_SPAN = 'Spatial-Span';
const FLANKER_TEST = 'Flanker-Test';
const WEEKLY_SURVEY = 'Epilepsy Weekly Survey';

// activity state captions
const PENDING = "pending";
const IN_PROGRESS = "in progress";
const COMPLETED = "completed";

function getPatientComplianceData(patientPin){
    var rawQuery = "SELECT ai.* " +
        " FROM activity_instance as ai, patients as pa " +
        " WHERE ai.PatientPinFk = pa.PatientPin AND pa.PatientPin = :pin " +
        "   AND ai.ActivityTitle in ('Pattern-Comparison', 'Finger-Tapping', 'Spatial-Span', 'Flanker-Test', 'Epilepsy Weekly Survey') ";

    return database.sequelize.query(rawQuery, {
        replacements: {pin: patientPin},
        type: database.sequelize.QueryTypes.SELECT
    });
}

function generateComplianceChartData(queryResults){
    var result = generateLabelsAndDataPropertyOfChart(queryResults);

    var chartData = {
        labels: result.labels,
        datasets: [
            {
                label: 'Pattern-Comparison',
                data: result.complianceData.patternComparison,
                backgroundColor: "#E74C3C"
            },
            {
                label: 'Finger-Tapping',
                data: result.complianceData.fingerTapping,
                backgroundColor: "#2C3E50"
            },
            {
                label: 'Spatial-Span',
                data: result.complianceData.spatialSpan,
                backgroundColor: "orange"
            },
            {
                label: 'Flanker-Test',
                data: result.complianceData.flankerTest,
                backgroundColor: "green"
            },
            {
                label: 'Weekly Survey',
                data: result.complianceData.weeklySurvey,
                backgroundColor: "brown"
            }
        ]
    };

    return chartData;
}

function generateLabelsAndDataPropertyOfChart(queryResults){
    var weeks = [];
    var complianceData = {
        patternComparison: [],
        fingerTapping: [],
        spatialSpan: [],
        flankerTest: [],
        weeklySurvey: []
    };

    queryResults.forEach(function(row){
        // format the date-time relative to date
        row.StartTime = moment.utc(row.StartTime).format(viewDateTimeFormat);
        row.EndTime = moment.utc(row.EndTime).format(viewDateTimeFormat);

        // for labels
        weeks.push(row.StartTime+' - '+row.EndTime);
        complianceData = getIndividualActivityCompliance(row, complianceData);
    });

    return {labels: getUniqueElements(weeks), complianceData: complianceData};
}

function getIndividualActivityCompliance(instance, complianceData){
    var totalActivities = 5;

    if (instance.State === COMPLETED) {
        switch (instance.activityTitle){
            case PATTERN_COMPARISON:
                complianceData.patternComparison.push(100/totalActivities);
                break;
            case FINGER_TAPPING:
                complianceData.fingerTapping.push(100/totalActivities);
                break;
            case SPATIAL_SPAN:
                complianceData.spatialSpan.push(100/totalActivities);
                break;
            case FLANKER_TEST:
                complianceData.flankerTest.push(100/totalActivities);
                break;
            case WEEKLY_SURVEY:
                complianceData.weeklySurvey.push(100/totalActivities);
                break;
            default:
            // do nothing
        }
    } else {
        switch (instance.activityTitle){
            case PATTERN_COMPARISON:
                complianceData.patternComparison.push(0);
                break;
            case FINGER_TAPPING:
                complianceData.fingerTapping.push(0);
                break;
            case SPATIAL_SPAN:
                complianceData.spatialSpan.push(0);
                break;
            case FLANKER_TEST:
                complianceData.flankerTest.push(0);
                break;
            case WEEKLY_SURVEY:
                complianceData.weeklySurvey.push(0);
                break;
            default:
            // do nothing
        }
    }

    return complianceData;
}

function getUniqueElements(arr){
    arr = arr.filter (function (value, index, array) {
        return array.indexOf (value) === index;
    });

    return arr;
}

module.exports.fetchPatientComplianceData = getPatientComplianceData;
module.exports.fetchComplianceChartData = generateComplianceChartData;