/*jslint node: true */
'use strict';

// import modules
const database = require('../model');
const moment = require('moment');
const viewDateTimeFormat = "MM-DD-YYYY h:mm a";

function getAllPatternComparisons(patientPin){
    var rawQuery = "SELECT pc.* " +
        "FROM pattern_comparison AS pc, patients AS pt " +
        "WHERE pc.PatientPinFK = pt.PatientPin AND pt.PatientPin = :pin " +
        "ORDER by pc.CreatedAt asc";

    return database.sequelize.query(rawQuery, {
        replacements: { pin: patientPin },
        type: database.sequelize.QueryTypes.SELECT
    });
}

function getRecentFivePatternComparisons(patientPin){
    var rawQuery = "SELECT pc.* " +
        "FROM pattern_comparison AS pc, patients AS pt " +
        "WHERE pc.PatientPinFK = pt.PatientPin AND pt.PatientPin = :pin " +
        "ORDER by pc.CreatedAt asc LIMIT 5";

    return database.sequelize.query(rawQuery, {
        replacements: { pin: patientPin },
        type: database.sequelize.QueryTypes.SELECT
    });
}

function formatPatternComparisons(queryResults){

    queryResults.forEach(function(instance){
        instance.answers = JSON.parse(instance.answers);
        instance.CreatedAt = moment(instance.CreatedAt).format(viewDateTimeFormat);
    });

    return queryResults;
}

function generateAverageAccuracyOfPatternComparisons(patternComparisons){
    var totalPatternComparisons = patternComparisons.length;
    var totalAccuracy = 0;

    patternComparisons.forEach(function(instance){
        totalAccuracy += calculatePatternComparisonAccuracy(instance.answers);
    });

    var average = totalAccuracy / totalPatternComparisons;

    return average.toFixed(1);
}

function calculatePatternComparisonAccuracy(patternComparisonQuestions){
    var wrongCount = 0;
    var rightCount = 0;

    patternComparisonQuestions.forEach(function(answer){
        if (answer.result) {
            rightCount++;
        } else {
            wrongCount++;
        }
    });

    return patternComparisonQuestions.length === 0 ? 0 : ((rightCount/patternComparisonQuestions.length) * 100);
}

function generateAggregateChartData(patternComparisons){
    var chartData = {
        labels: [],
        datasets: [
            {
                label: "Pattern-Comparison Accuracy",
                fill: false,
                lineTension: 0.1,
                backgroundColor: "rgba(231,76,60,0.4)",
                borderColor: "rgba(231,76,60,1)",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "rgba(231,76,60,1)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(231,76,60,1)",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: [],
                spanGaps: false,
                yAxisID: 'y-axis-0'
            }
        ]
    };

    patternComparisons.forEach(function(instance){
        chartData.labels.push(instance.CreatedAt);
        chartData.datasets[0].data.push(calculatePatternComparisonAccuracy(instance.answers));
    });

    return JSON.stringify(chartData);
}

function generatePatternComparisonActivities(patternComparisons){
    var activitiesData = [];

    if (patternComparisons.length !== 0) {
        patternComparisons.forEach(function(instance){
            instance.accuracy = calculatePatternComparisonAccuracy(instance.answers);
        });

        activitiesData = JSON.stringify(flankerTests);
    }

    return activitiesData;
}

function generatePatternComparisonActivitiesListData(patternComparisons){
    var listData = [];

    patternComparisons.forEach(function(instance){
        listData.push({id: instance.id, CreatedAt: instance.CreatedAt});
    });

    return listData;
}

module.exports.fetchAllPatternComparisons = getAllPatternComparisons;
module.exports.fetchRecentFivePatternComparisons = getRecentFivePatternComparisons;
module.exports.fetchFormattedPatternComparisons = formatPatternComparisons;
module.exports.fetchAverageAccuracy = generateAverageAccuracyOfPatternComparisons;
module.exports.fetchAggregateChartData = generateAggregateChartData;
module.exports.fetchPatternComparisonActivities = generatePatternComparisonActivities;
module.exports.fetchPatternComparisonActivitiesListData = generatePatternComparisonActivitiesListData;