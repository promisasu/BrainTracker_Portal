/*jslint node: true */
"use strict";

const database = require('../../model');
const moment = require('moment');

function fingerTappingView(request, reply, patientPin){

    Promise.all([
        getTrialAndPatientIds(patientPin),
        getAllFingerTapping(patientPin)
    ]).then(function(values){
        var fingerTapping = values[1];

        fingerTapping.forEach(function (tap){
            tap.CreatedAt = moment(tap.CreatedAt).format('MM-DD-YYYY h:mm a');
        });

        return reply.view('finger-tapping', {
            title: 'Epilepsy | Finger-Tapping',
            breadCrumbData: values[0][0],   // get the first record of trialAndPatientIds Query
            fingerTapping: fingerTapping
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

module.exports = fingerTappingView;
