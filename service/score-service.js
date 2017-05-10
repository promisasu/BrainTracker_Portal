/*jslint node: true */
'use strict';

// import modules
const database = require('../model');


//fetch Survey Results
function getSurveyResults(patientPin) {

    var rawQuery = "SELECT ai.PatientPinFK as pin, ai.activityTitle as name, "+
    " ai.UserSubmissionTime as date, act.ActivityInstanceIdFk as id, "+
    " act.questionIdFk as questionId, act.questionOptionIdFk as optionId, "+
    " ans.OptionText as optionText, que.SurveyBlockIdFk as questionType, "+
    " ai.StartTime as StartTime, ans.likertScale as likertScale, pi.type as patientType "+
    " FROM question_result act JOIN questions que "+
    " ON act.questionIdFk = que.QuestionId "+
    " JOIN question_options ans "+
    " ON act.questionOptionIdFk = ans.QuestionOptionId "+
    " JOIN activity_instance ai "+
    " ON act.ActivityInstanceIdFk = ai.ActivityInstanceId "+
    " JOIN patients pi "+
    " ON ai.PatientPinFK = pi.PatientPin "+
    " WHERE act.ActivityInstanceIdFk "+
    " IN (SELECT ActivityInstanceId FROM activity_instance WHERE PatientPinFK = :pin " +
    "and State='completed' and ai.activityTitle='Epilepsy Weekly Survey'); "

    return database.sequelize.query(rawQuery, {
        replacements: {pin: patientPin},
        type: database.sequelize.QueryTypes.SELECT
    });
}

//fetch opioidResults
function getopioidResults(patientPin) {

    var rawQuery = " SELECT ai.PatientPinFK as pin, ai.activityTitle as name, "+
    " ai.UserSubmissionTime as date, act.ActivityInstanceIdFk as id, "+
    " act.questionIdFk as questionId, act.questionOptionIdFk as optionId, "+
    " ans.OptionText as optionText, act.dosage, que.SurveyBlockIdFk as questionType, "+
    " ai.StartTime as StartTime, ans.likertScale as likertScale, "+
    " pi.type as patientType, mi.prescribedDosage, "+
    " mi.noOfTablets as prescribedNoOfTablets "+
    " FROM question_result act "+
    " JOIN questions que "+
    " ON act.questionIdFk = que.QuestionId "+
    " JOIN question_options ans "+
    " ON act.questionOptionIdFk = ans.QuestionOptionId "+
    " JOIN activity_instance ai "+
    " ON act.ActivityInstanceIdFk = ai.ActivityInstanceId "+
    " JOIN patients pi "+
    " ON ai.PatientPinFK = pi.PatientPin "+
    " JOIN medication_information mi "+
    " ON mi.PatientPINFK = ai.PatientPinFK and mi.MedicationName = ans.optionText "+
    " WHERE act.ActivityInstanceIdFk "+
    " IN (SELECT ActivityInstanceId FROM activity_instance WHERE PatientPinFK = :pin and State='completed' and ai.activityTitle='Epilepsy Daily Survey'); "

    return database.sequelize.query(rawQuery, {
        replacements: {pin: patientPin},
        type: database.sequelize.QueryTypes.SELECT
    });
}

//fetch body results
function getBodyPainResults(patientPin) {

    var rawQuery = " SELECT ai.PatientPinFK as pin, ai.activityTitle as name, "+
    " ai.UserSubmissionTime as date, act.ActivityInstanceIdFk as id, "+
    " act.questionIdFk as questionId, act.questionOptionIdFk as optionId, "+
    " ans.OptionText as optionText, que.SurveyBlockIdFk as questionType, "+
    " ai.StartTime as StartTime, ans.likertScale as likertScale, pi.type as patientType "+
    " FROM question_result act "+
    " JOIN questions que "+
    " ON act.questionIdFk = que.QuestionId "+
    " JOIN question_options ans "+
    " ON act.questionOptionIdFk = ans.QuestionOptionId "+
    " JOIN activity_instance ai "+
    " ON act.ActivityInstanceIdFk = ai.ActivityInstanceId "+
    " JOIN patients pi "+
    " ON ai.PatientPinFK = pi.PatientPin "+
    " WHERE act.ActivityInstanceIdFk "+
    " IN (SELECT ActivityInstanceId FROM activity_instance WHERE PatientPinFK = :pin and State='completed' and que.questionId IN (74)); "

    return database.sequelize.query(rawQuery, {
        replacements: {pin: patientPin},
        type: database.sequelize.QueryTypes.SELECT
    });
}




module.exports.fetchSurveyResults = getSurveyResults;
module.exports.fetchopioidResults = getopioidResults;
module.exports.fetchbodypainResults = getBodyPainResults;

