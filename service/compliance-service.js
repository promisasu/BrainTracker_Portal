/*jslint node: true */
'use strict';

// import modules
const database = require('../model');
const moment = require('moment');
const viewDateTimeFormat = "MM/DD/YYYY hh:mm a";
const chartDateFormat = "MM/DD/YYYY";

// captions
const PATTERN_COMPARISON = 'Pattern-Comparison';
const FINGER_TAPPING = 'Finger-Tapping';
const SPATIAL_SPAN = 'Spatial-Span';
const FLANKER_TEST = 'Flanker-Test';
const WEEKLY_SURVEY = 'Epilepsy Weekly Survey';
const PARENT_PROXY = 'Parent-Proxy Weekly Survey';

// activity state captions
const PENDING = "pending";
const IN_PROGRESS = "in progress";
const COMPLETED = "completed";
const EXPIRED = "expired";

function getPatientComplianceData(patientPin, parentPin){

    var rawQuery = "SELECT ai.* " +
        " FROM activity_instance as ai, patients as pa " +
        " WHERE ai.PatientPinFk = pa.PatientPin AND (pa.PatientPin = :pin OR pa.ParentPinFK = :parentPin) " +
        "   AND ai.ActivityTitle in ('Pattern-Comparison', 'Finger-Tapping', 'Spatial-Span', 'Flanker-Test', 'Epilepsy Weekly Survey', 'Parent-Proxy Weekly Survey') ORDER BY ai.StartTime";

    return database.sequelize.query(rawQuery, {
        replacements: {pin: patientPin, parentPin: parentPin},
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
                backgroundColor: "#4c8f4d"
            },
            {
                label: 'Flanker-Test',
                data: result.complianceData.flankerTest,
                backgroundColor: "#3370b5"
            },
            {
                label: 'Weekly Survey',
                data: result.complianceData.weeklySurvey,
                backgroundColor: "orange"
            },
            {
                label: 'Parent-Proxy Weekly Survey',
                data:result.complianceData.parentProxy,
                backgroundColor: "#6f4d2b"
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
        weeklySurvey: [],
        parentProxy: []
    };

    queryResults.forEach(function(row){
        // format the date-time relative to date
        row.StartTime = moment.utc(row.StartTime).format(chartDateFormat);
        row.EndTime = moment.utc(row.EndTime).format(chartDateFormat);

        // for labels
        weeks.push(row.StartTime+' - '+row.EndTime);
        complianceData = getIndividualActivityCompliance(row, complianceData);
    });

    var chartLabels = getUniqueElements(weeks);
    complianceData = addDummyData(complianceData, chartLabels.length);

    return {labels: chartLabels, complianceData: complianceData};
}

function getIndividualActivityCompliance(instance, complianceData){
    var totalActivities = 6;

    if (instance.State === COMPLETED) {
        switch (instance.activityTitle.toLowerCase()){
            case PATTERN_COMPARISON.toLowerCase():
                complianceData.patternComparison.push(100/totalActivities);
                break;
            case FINGER_TAPPING.toLowerCase():
                complianceData.fingerTapping.push(100/totalActivities);
                break;
            case SPATIAL_SPAN.toLowerCase():
                complianceData.spatialSpan.push(100/totalActivities);
                break;
            case FLANKER_TEST.toLowerCase():
                complianceData.flankerTest.push(100/totalActivities);
                break;
            case WEEKLY_SURVEY.toLowerCase():
                complianceData.weeklySurvey.push(100/totalActivities);
                break;
            case PARENT_PROXY.toLowerCase():
                complianceData.parentProxy.push(100/totalActivities);
                break;
            default:
            // do nothing
        }
    } else {
        switch (instance.activityTitle.toLowerCase()){
            case PATTERN_COMPARISON.toUpperCase():
                complianceData.patternComparison.push(0);
                break;
            case FINGER_TAPPING.toLowerCase():
                complianceData.fingerTapping.push(0);
                break;
            case SPATIAL_SPAN.toLowerCase():
                complianceData.spatialSpan.push(0);
                break;
            case FLANKER_TEST.toLowerCase():
                complianceData.flankerTest.push(0);
                break;
            case WEEKLY_SURVEY.toLowerCase():
                complianceData.weeklySurvey.push(0);
                break;
            case PARENT_PROXY.toLowerCase():
                complianceData.parentProxy.push(0);
                break;
            default:
            // do nothing
        }
    }

    return complianceData;
}

function addDummyData(complianceData, totalLabels){
    var loopCounter = 0;

    // pattern-comparison
    if (complianceData.patternComparison.length < totalLabels){
        loopCounter = totalLabels-complianceData.patternComparison.length;

        for (var i = 0; i< loopCounter; i++){
            complianceData.patternComparison.push(0);
        }
    }

    // finger-tapping
    if (complianceData.fingerTapping.length < totalLabels){
        loopCounter = totalLabels-complianceData.fingerTapping.length;

        for (var i = 0; i< loopCounter; i++){
            complianceData.fingerTapping.push(0);
        }
    }

    // spatial-span
    if (complianceData.spatialSpan.length < totalLabels){
        loopCounter = totalLabels-complianceData.spatialSpan.length;

        for (var i = 0; i< loopCounter; i++){
            complianceData.spatialSpan.push(0);
        }
    }

    // flanker-test
    if (complianceData.flankerTest.length < totalLabels){
        loopCounter = totalLabels-complianceData.flankerTest.length;

        for (var i = 0; i< loopCounter; i++){
            complianceData.flankerTest.push(0);
        }
    }

    // weekly-survey
    if (complianceData.weeklySurvey.length < totalLabels){
        loopCounter = totalLabels-complianceData.weeklySurvey.length;

        for (var i = 0; i< loopCounter; i++){
            complianceData.weeklySurvey.push(0);
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

function generateComplianceActivities(queryResults){
    queryResults.forEach(function(instance){
        instance.StartTime = moment(new Date(instance.StartTime)).format(viewDateTimeFormat);
        instance.EndTime = moment(new Date(instance.EndTime)).format(viewDateTimeFormat);

        // modify/update the state of the instance
        instance = getActivityInstanceState(instance);

        instance.status = getStatus(instance.State);

        if (instance.UserSubmissionTime !== null) {
            instance.UserSubmissionTime = moment(new Date(instance.UserSubmissionTime)).format(viewDateTimeFormat);
        } else {
            instance.UserSubmissionTime = 'N/A';
        }
    });

    return queryResults;

}

function getStatus(state){
    // success | warning | info | danger
    var status = "danger";

    switch (state.toLowerCase()){
        case COMPLETED:
            status = "success";
            break;
        case IN_PROGRESS:
            status = "warning";
            break;
        case PENDING:
            status = "info";
            break;
        case EXPIRED:
            status = "danger";
            break;
        default:
            // do nothing
    }

    return status;
}

function getActivityInstanceState(activityInstance){
    // check if the state is pending and whether the endDate is passed, if yes set the state as 'Expired'
    if (activityInstance.State.toLowerCase() !== COMPLETED && moment().isAfter(new Date(activityInstance.EndTime))){
        activityInstance.State = capitalize('expired');
    } else {
        activityInstance.State = capitalize(activityInstance.State);
    }

    return activityInstance;
}

function capitalize(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

function generateActivitiesStats(queryResults){
    var stats = {completed: 0, inProgress: 0, expired: 0, pending:0};

    queryResults.forEach(function(instance){

        switch(instance.State.toLowerCase()){
            case COMPLETED:
                stats.completed++;
                break;
            case IN_PROGRESS:
                stats.inProgress++;
                break;
            case PENDING:
                stats.pending++;
                break;
            case EXPIRED:
                stats.expired++;
                break;
            default:
                // do nothing
        }
    });

    return stats;
}

function getParentActivities(parentPin){
    var rawQuery = "SELECT ai.* " +
        " FROM activity_instance as ai, patients as pa " +
        " WHERE ai.PatientPinFk = pa.PatientPin AND pa.type in ('parent_proxy') AND pa.patientPin = :pin " +
        "   AND ai.ActivityTitle in ('Parent-Proxy Weekly Survey') ORDER BY ai.StartTime";

    return database.sequelize.query(rawQuery, {
        replacements: {pin: parentPin},
        type: database.sequelize.QueryTypes.SELECT
    });
}

function getChildActivities(childPin){
    var rawQuery = "SELECT ai.* " +
        " FROM activity_instance as ai, patients as pa " +
        " WHERE ai.PatientPinFk = pa.PatientPin AND pa.type in ('child') AND pa.patientPin = :pin " +
        "   AND ai.ActivityTitle in ('Pattern-Comparison', 'Finger-Tapping', 'Spatial-Span', 'Flanker-Test', 'Epilepsy Weekly Survey') ORDER BY ai.StartTime";

    return database.sequelize.query(rawQuery, {
        replacements: {pin: childPin},
        type: database.sequelize.QueryTypes.SELECT
    });
}

module.exports.fetchPatientComplianceData = getPatientComplianceData;
module.exports.fetchComplianceChartData = generateComplianceChartData;
module.exports.fetchComplianceActivities = generateComplianceActivities;
module.exports.fetchActivitiesStats = generateActivitiesStats;
module.exports.fetchParentActivities = getParentActivities;
module.exports.fetchChildActivities = getChildActivities;