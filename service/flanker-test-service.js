/*jslint node: true */
'use strict';

// import modules
const database = require('../model');
const moment = require('moment');
const viewDateTimeFormat = "MM-DD-YYYY hh:mm a";

function getAllFlankerTestActivities(patientPin){
    var rawQuery = "SELECT ft.* " +
        "FROM flanker as ft, patients as pt " +
        "WHERE ft.PatientPinFK = pt.PatientPin AND pt.PatientPin = :pin order by ft.CreatedAt asc";

    return database.sequelize.query(rawQuery, {
        replacements: { pin: patientPin },
        type: database.sequelize.QueryTypes.SELECT
    });
}

function getRecentFiveFlankerTests(patientPin){
    var rawQuery = "SELECT ft.* " +
        "FROM flanker as ft, patients as pt " +
        "WHERE ft.PatientPinFK = pt.PatientPin AND pt.PatientPin = :pin " +
        "order by ft.CreatedAt asc LIMIT 5";

    return database.sequelize.query(rawQuery, {
        replacements: { pin: patientPin },
        type: database.sequelize.QueryTypes.SELECT
    });
}

function formatFlankerTests(queryResults){
    queryResults.forEach(function(instance){
        instance.answers = JSON.parse(instance.answers);
        instance.CreatedAt = moment.utc(instance.CreatedAt).format(viewDateTimeFormat);
    });

    return queryResults;
}

function generateSelectListData(flankerTests){
    var listData = [];

    flankerTests.forEach(function(instance){
        listData.push({id: instance.id, CreatedAt: instance.CreatedAt});
    });

    return listData;
}

function generateAggregateChartData(flankerTests){
    var chartData = {
        labels: [],
        datasets: [
            {
                label: "Flanker-Test Accuracy",
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
                pointRadius: 10,
                pointHitRadius: 10,
                data: [],
                spanGaps: false
            }
        ]
    };

    // add dummy non-rendering points to left and right by using empty string labels and null value when
    // only one data-point is available

    if (flankerTests.length === 1){
        chartData.labels = ["", flankerTests[0].CreatedAt, ""];
        chartData.datasets[0].data = [null, calculateFlankerTestAccuracy(flankerTests[0].answers), null];
    } else {
        flankerTests.forEach(function(instance){
            chartData.labels.push(instance.CreatedAt);
            chartData.datasets[0].data.push(calculateFlankerTestAccuracy(instance.answers));
        });
    }

    return JSON.stringify(chartData);
}

function calculateFlankerTestAccuracy(flankerTestAnswers){
    var wrongCount = 0;
    var rightCount = 0;

    flankerTestAnswers.forEach(function(answer){
        if (answer.result) {
            rightCount++;
        } else {
            wrongCount++;
        }
    });

    return flankerTestAnswers.length === 0 ? 0 : ((rightCount/flankerTestAnswers.length) * 100);
}

function generateAverageAccuracyOfFlankerTests(flankerTests){
    var totalFlankerTests = flankerTests.length;
    var totalAccuracy = 0;

    flankerTests.forEach(function(test){
        totalAccuracy += calculateFlankerTestAccuracy(test.answers);
    });

    var average = totalAccuracy / totalFlankerTests;

    return average.toFixed(1);
}

function generateFlankerTestActivitiesData(flankerTests){
    var activitiesData = [];

    if (flankerTests.length !== 0) {
        flankerTests.forEach(function(test){
            test.accuracy = calculateFlankerTestAccuracy(test.answers);
        });

        activitiesData = JSON.stringify(flankerTests);
    }

    return activitiesData;
}

// exporting modules
module.exports.fetchAllFlankerTestActivities = getAllFlankerTestActivities;
module.exports.fetchFormattedFlankerTests = formatFlankerTests;
module.exports.fetchFlankerTestActivitiesSelectData = generateSelectListData;
module.exports.fetchAggregateChartData = generateAggregateChartData;
module.exports.fetchAverageAccuracy = generateAverageAccuracyOfFlankerTests;
module.exports.fetchFlankerTestActivitiesData = generateFlankerTestActivitiesData;
module.exports.fetchRecentFiveFlankerTests = getRecentFiveFlankerTests;