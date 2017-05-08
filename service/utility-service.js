/*jslint node: true */
'use strict';

// import modules
const database = require('../model');

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

function getPatient(patientPin){
    var rawQuery = "SELECT pt.PatientPin " +
        "FROM patients as pt " +
        "WHERE pt.PatientPin = :pin LIMIT 1"

    return database.sequelize.query(rawQuery, {
        replacements: {pin: patientPin},
        type: database.sequelize.QueryTypes.SELECT
    });
}

module.exports.fetchTrialAndPatientIds = getTrialAndPatientIds;
module.exports.fetchPatient = getPatient;