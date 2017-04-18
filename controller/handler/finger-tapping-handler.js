/*jslint node: true */
"use strict";

const database = require('../../model');
const moment = require('moment');
const viewDateTimeFormat = "MM-DD-YYYY h:mm a";

function fingerTappingView(request, reply, patientPin){

    Promise.all([
        getTrialAndPatientIds(patientPin),
        getAllFingerTapping(patientPin)
    ]).then(function(values){
        var fingerTapping = values[1];

        fingerTapping.forEach(function (tap){
            tap.result = JSON.parse(tap.result);
            tap.CreatedAt = moment(tap.CreatedAt).format(viewDateTimeFormat);
        });

        return reply.view('finger-tapping', {
            title: 'Epilepsy | Finger-Tapping',
            breadCrumbData: values[0][0],   // get the first record of trialAndPatientIds Query
            fingerTapping: fingerTapping,
            averageTaps: generateAverageTaps(fingerTapping),
            chartData: JSON.stringify(generateFingerTappingChartData(fingerTapping)),
            activitiesData: generateFingerTappingActivitiesData(fingerTapping)
        });

    }).catch(function(err){
        console.log(err);
        return reply({code: 500, message: 'Something went Wrong!'}).code(500);
    });
}

// fetch trial Id and patient's pin for breadcrumb
function getTrialAndPatientIds(patientPin){
    var rawQuery = "SELECT tr.TrialId, tr.Name, pt.PatientPin " +
        "FROM trial as tr, stage as st, patients as pt " +
        "WHERE pt.PatientPin = :pin AND pt.StageIdFK = st.StageId AND st.TrialId = tr.TrialId ";

    return database.sequelize.query(rawQuery, {
        replacements: {pin: patientPin},
        type: database.sequelize.QueryTypes.SELECT
    });
}

// fetch all of the finger-tapping of selected patient
function getAllFingerTapping(patientPin){
    var rawQuery = "SELECT ft.* " +
        "FROM finger_tapping AS ft, patients AS pt, activity_instance AS at, stage AS st, trial AS tr " +
        "WHERE ft.PatientPinFK = pt.PatientPin AND ft.ActivityInstanceIdFK = at.ActivityInstanceId AND " +
        "pt.PatientPin = :pin AND pt.StageIdFK = st.StageId AND st.TrialId = tr.TrialId";

    return database.sequelize.query(rawQuery, {
        replacements: { pin: patientPin },
        type: database.sequelize.QueryTypes.SELECT
    });
}

function generateFingerTappingChartData(fingerTapping){
    var chartData = {
        labels: [],
        datasets: [
            {
                label: 'Right-Hand',
                backgroundColor: 'rgba(44, 62, 80,0.5)',
                data: []
            },
            {
                label: 'Left-Hand',
                backgroundColor: 'rgba(231, 76, 60,0.5)',
                data: []
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

    return chartData;
}

function generateFingerTappingActivitiesData(fingerTapping){
    var activitiesData = [];

    if (fingerTapping.length > 0){
        activitiesData = JSON.stringify(fingerTapping);
    }

    return activitiesData;
}

// generate average taps for each hand
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

module.exports = fingerTappingView;
