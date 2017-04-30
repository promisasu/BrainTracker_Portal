/*jslint node: true */
'use strict';

// import modules
const database = require('../model');
const moment = require('moment');
const viewDateTimeFormat = "MM-DD-YYYY h:mm a";

// fetch all of the finger-tapping of selected patient
function getAllFingerTapping(patientPin){
    var rawQuery = "SELECT ft.* " +
        "FROM finger_tapping AS ft, patients AS pt, activity_instance AS at, stage AS st, trial AS tr " +
        "WHERE ft.PatientPinFK = pt.PatientPin AND ft.ActivityInstanceIdFK = at.ActivityInstanceId AND " +
        "pt.PatientPin = :pin AND pt.StageIdFK = st.StageId AND st.TrialId = tr.TrialId "+
        "ORDER BY ft.CreatedAt asc";

    return database.sequelize.query(rawQuery, {
        replacements: { pin: patientPin },
        type: database.sequelize.QueryTypes.SELECT
    });
}
function getFiveFingerTapping(patientPin){
    var rawQuery = "SELECT ft.* " +
        "FROM finger_tapping AS ft, patients AS pt, activity_instance AS at, stage AS st, trial AS tr " +
        "WHERE ft.PatientPinFK = pt.PatientPin AND ft.ActivityInstanceIdFK = at.ActivityInstanceId AND " +
        "pt.PatientPin = :pin AND pt.StageIdFK = st.StageId AND st.TrialId = tr.TrialId "+
        "ORDER BY ft.CreatedAt asc LIMIT 5";

    return database.sequelize.query(rawQuery, {
        replacements: { pin: patientPin },
        type: database.sequelize.QueryTypes.SELECT
    });
}

function generateFormattedFingerTapping(queryResults){
    queryResults.forEach(function (tap){
        tap.result = JSON.parse(tap.result);
        tap.CreatedAt = moment(tap.CreatedAt).format(viewDateTimeFormat);
    });

    return queryResults;
}

function generateAverageTaps(fingerTapping){
    var averageTaps = {
        "rightHand": 0,
        "leftHand": 0
    };

    var numberOfTaps = fingerTapping.length;
    var leftHandSum = 0;
    var rightHandSum = 0;

    if (numberOfTaps > 0) {
        fingerTapping.forEach(function(tap){
            leftHandSum += tap.result.left;
            rightHandSum += tap.result.right;
        });

        averageTaps.rightHand = rightHandSum / numberOfTaps;
        averageTaps.leftHand = leftHandSum / numberOfTaps;
    }

    return averageTaps;
}

function generateFingerTappingActivitiesData(fingerTapping){
    var activitiesData = [];

    if (fingerTapping.length > 0){
        activitiesData = JSON.stringify(fingerTapping);
    }

    return activitiesData;
}

function generateFingerTappingChartData(fingerTapping){
    var chartData = {
        labels: [],
        datasets: [
            {
                label: "Right-Hand",
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
                spanGaps: false
            },
            {
                label: "Left-Hand",
                fill: false,
                lineTension: 0.1,
                backgroundColor: "rgba(44,62,80,0.4)",
                borderColor: "rgba(44,62,80,1)",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "rgba(44,62,80,1)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(44,62,80,1)",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: [],
                spanGaps: false
            }
        ]
    };

    fingerTapping.forEach(function(tap){
        // populate the labels array
        chartData.labels.push(tap.CreatedAt);

        // populate the datasets
        chartData.datasets[0].data.push(tap.result.right);
        chartData.datasets[1].data.push(tap.result.left);
    });

    return JSON.stringify(chartData);
}

module.exports.fetchAllFingerTapping = getAllFingerTapping;
module.exports.fetchFiveFingerTapping = getFiveFingerTapping;
module.exports.fetchFormattedFingerTapping = generateFormattedFingerTapping;
module.exports.fetchAverageTaps = generateAverageTaps;
module.exports.fetchActivitiesData = generateFingerTappingActivitiesData;
module.exports.fetchFingerTappingChartData = generateFingerTappingChartData;