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
// fetch patient's IDs for Handler
function getPatientIds(patientPin){
    var rawQuery = " SELECT pa.PatientPin, st.Name AS stage "+
    " FROM patients AS pa "+
    " JOIN stage AS st "+
    " ON st.StageId = pa.StageIdFK "+
    " WHERE pa.PatientPin = :pin ";
  
    return database.sequelize.query(rawQuery, {
        replacements: {pin: patientPin},
        type: database.sequelize.QueryTypes.SELECT
    });
  
}

// function to get the patient 
function getPatient(patientPin){
    var rawQuery = "SELECT pt.PatientPin " +
        "FROM patients as pt " +
        "WHERE pt.PatientPin = :pin LIMIT 1"

    return database.sequelize.query(rawQuery, {
        replacements: {pin: patientPin},
        type: database.sequelize.QueryTypes.SELECT
    });
}

// fetch Trial IDs for Handler
function getTrialIds(patientPin){
    var rawQuery = " SELECT tr.Name, tr.TrialId "+
    " FROM patients AS pa "+
    " JOIN stage AS st "+
    " ON st.StageId = pa.StageIdFK "+
    " JOIN trial AS tr "+
    " ON tr.TrialId = st.TrialId "
    " WHERE pa.PatientPin = :pin ";

    return database.sequelize.query(rawQuery, {
        replacements: {pin: patientPin},
        type: database.sequelize.QueryTypes.SELECT
    });
}



module.exports.fetchTrialAndPatientIds = getTrialAndPatientIds;
module.exports.fetchPatientIds = getPatientIds;
module.exports.fetchTrialsIds = getTrialIds;
module.exports.fetchTrialAndPatientIds = getTrialAndPatientIds;
module.exports.fetchPatient = getPatient;
