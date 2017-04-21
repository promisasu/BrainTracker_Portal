/*jslint node: true */
'use strict';

// import modules
const database = require('../model');
const moment = require('moment');
const viewDateTimeFormat = "MM-DD-YYYY h:mm a";

// fetch trial Id and patient's pin for breadcrumb
function getTrialAndPatientIds(patientPin){
    var rawQuery = "SELECT tr.TrialId, tr.Name, pt.PatientPin " +
        "FROM trial as tr, stage as st, patients as pt " +
        "WHERE pt.PatientPin = :pin AND pt.StageIdFK = st.StageId AND st.TrialId = tr.TrialId LIMIT 1";

    return database.sequelize.query(rawQuery, {
        replacements: {pin: patientPin},
        type: database.sequelize.QueryTypes.SELECT
    });
}

// fetch all spatial-span activities of patient
function getAllSpatialSpanActivities(patientPin){
    var rawQuery = "SELECT ss.* " +
        "FROM spatial_span as ss, patients as pt " +
        "WHERE ss.PatientPinFK = pt.PatientPin AND pt.PatientPin = :pin order by ss.CreatedAt asc";

    return database.sequelize.query(rawQuery, {
        replacements: { pin: patientPin },
        type: database.sequelize.QueryTypes.SELECT
    });
}

// format the output of spatial-span activities: format CreatedAt and parse the json format of result column
function formatSpatialSpanActivities(queryResults){
    queryResults.forEach(function(instance){
        instance.result = JSON.parse(instance.result);
        instance.createdAt = moment(instance.CreatedAt).format(viewDateTimeFormat);
    });

    return queryResults;
}

// generate the data block only consisting of id & CreatedAt for rendering as options in Select box
function generateSelectListData(spatialSpanActivities){
    var listData = [];
    spatialSpanActivities.forEach(function(instance){
        listData.push({id: instance.id, createdAt: instance.CreatedAt});
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
                backgroundColor: "rgb(231,76,60)",
                borderColor: "#3498DB",
                borderWidth: 2,
                hoverBackgroundColor: "rgba(255,99,132,0.4)",
                hoverBorderColor: "rgba(255,99,132,1)",
                data: []
            }
        ]
    };

    spatialSpanActivities.forEach(function(instance){
        chartData.labels.push(instance.createdAt);
        chartData.datasets[0].data.push(calculateAccuracy(instance.result));
    });

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

function generateAverageAccuracy(spatialSpanActivities){
    var totalActivities = spatialSpanActivities.length;
    var totalAccuracy = 0;

    spatialSpanActivities.forEach(function(activity){
        totalAccuracy += calculateAccuracy(activity.result);
    });

    return totalAccuracy / totalActivities;
}

// module exports
module.exports.fetchAllSpatialSpanActivities = getAllSpatialSpanActivities;
module.exports.fetchTrialAndPatientIds = getTrialAndPatientIds;
module.exports.fetchFormattedSpatialSpanActivities = formatSpatialSpanActivities;
module.exports.fetchSelectListData = generateSelectListData;
module.exports.fetchSpatialSpanChartData = generateSpatialSpanChartData;
module.exports.fetchAverageAccuracy = generateAverageAccuracy;