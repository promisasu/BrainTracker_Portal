/*jslint node: true */
'use strict';

// import modules
const database = require('../model');
const moment = require('moment');
const viewDateTimeFormat = "MM-DD-YYYY h:mm a";

// fetch all spatial-span activities of patient
function getAllSpatialSpanActivities(patientPin){
    var rawQuery = "SELECT ss.* " +
        "FROM spatial_span as ss, patients as pt " +
        "WHERE ss.PatientPinFK = pt.PatientPin AND pt.PatientPin = :pin "+
        " order by ss.CreatedAt asc";

    return database.sequelize.query(rawQuery, {
        replacements: { pin: patientPin },
        type: database.sequelize.QueryTypes.SELECT
    });
}

// format the output of spatial-span activities: format CreatedAt and parse the json format of result column
function formatSpatialSpanActivities(queryResults){
    queryResults.forEach(function(instance){
        instance.answers = JSON.parse(instance.answers);
        instance.CreatedAt = moment(instance.CreatedAt).format(viewDateTimeFormat);
    });

    return queryResults;
}

// generate the data block only consisting of id & CreatedAt for rendering as options in Select box
function generateSelectListData(spatialSpanActivities){
    var listData = [];
    spatialSpanActivities.forEach(function(instance){
        listData.push({id: instance.id, CreatedAt: instance.CreatedAt});
    });

    return listData;
}

// generate data for spatial-span aggregate chart
function generateSpatialSpanChartData(spatialSpanActivities){
    var chartData = {
        labels: [],
        datasets: [
            {
                type: 'line',
                label: 'Spatial Span Accuracy',
                fill: false,
                backgroundColor: "#E74C3C",
                borderColor: "rgba(231, 76, 60,0.5)",
                borderWidth: 2,
                hoverBackgroundColor: "rgba(255,99,132,0.4)",
                hoverBorderColor: "rgba(255,99,132,1)",
                data: [],
                yAxisID: 'y-axis-1'
            },
            {
                type: 'bar',
                label: "Level",
                data: [],
                fill: false,
                backgroundColor: '#2C3E50',
                borderColor: '#2C3E50',
                hoverBackgroundColor: '#2C3E50',
                hoverBorderColor: '#2C3E50',
                yAxisID: 'y-axis-2'
            }
        ]
    };

    spatialSpanActivities.forEach(function(instance){
        chartData.labels.push(instance.CreatedAt);
        chartData.datasets[0].data.push(calculateAccuracy(instance.answers));
        chartData.datasets[1].data.push(calculateMaxLevel(instance.answers));
    });

    console.log(chartData);
    console.log(JSON.stringify(chartData));

    return JSON.stringify(chartData);
}

// calculate accuracy based on right/wrong answer irrespective of level of question
function calculateAccuracy(chances){
    var falseCount = 0;
    var trueCount = 0;

    chances.forEach(function(chance){
        if (chance.result){
            trueCount++;
        } else {
            falseCount++;
        }
    });

    return chances.length === 0 ? 0 : ((trueCount/chances.length) * 100);
}

function calculateMaxLevel(chances){
    // min level to start the game is 2;
    var maxDifficulty = 2;

    chances.forEach(function(chance){
        if (chance.difficulty > maxDifficulty) {
            maxDifficulty = chance.difficulty;
        }
    });

    return maxDifficulty;
}

function generateAverageAccuracy(spatialSpanActivities){
    var totalActivities = spatialSpanActivities.length;
    var totalAccuracy = 0;

    spatialSpanActivities.forEach(function(activity){
        totalAccuracy += calculateAccuracy(activity.answers);
    });

    return totalAccuracy / totalActivities;
}

function generateActivitiesData(spatialSpanActivities){
    var activitiesData = [];

    if (spatialSpanActivities.length !== 0) {
        // add components accuracy and maximumLevel for view activity details part in dashboard
        spatialSpanActivities.forEach(function(activity){
            activity.accuracy = calculateAccuracy(activity.answers);
            activity.maxLevel = calculateMaxLevel(activity.answers);
        });

        activitiesData = JSON.stringify(spatialSpanActivities);
    }

    return activitiesData;
}

function getRecentFiveActivities(patientPin){

    var rawQuery = "SELECT ss.* " +
        "FROM spatial_span as ss, patients as pt " +
        "WHERE ss.PatientPinFK = pt.PatientPin AND pt.PatientPin = :pin "+
        " order by ss.CreatedAt desc LIMIT 5";

    return database.sequelize.query(rawQuery, {
        replacements: { pin: patientPin },
        type: database.sequelize.QueryTypes.SELECT
    });
}

// module exports
module.exports.fetchAllSpatialSpanActivities = getAllSpatialSpanActivities;
module.exports.fetchFormattedSpatialSpanActivities = formatSpatialSpanActivities;
module.exports.fetchSelectListData = generateSelectListData;
module.exports.fetchSpatialSpanChartData = generateSpatialSpanChartData;
module.exports.fetchAverageAccuracy = generateAverageAccuracy;
module.exports.fetchActivitiesData = generateActivitiesData;
module.exports.fetchRecentFiveActivities = getRecentFiveActivities;