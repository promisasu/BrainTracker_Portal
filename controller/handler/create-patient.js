'use strict';

/**
 * @module controller/handler/create-patient
 */

// import modules
const database = require('../../model');
const utilityService = require('../../service/utility-service');

/**
 * Creates a new Patient
 * @param {Request} request - Hapi request
 * @param {Reply} reply - Hapi Reply
 * @returns {Null} Redirect
 */
function createPatient (request, reply) {
    // TODO -- Work in Progress

    console.log(request.payload);
    console.log('==========');

    const patientPin = request.payload.patientPin;
    const trialId = request.payload.trialId;
    const startDate = request.payload.startDate;

    Promise.all([
        utilityService.fetchPatient(patientPin),
        utilityService.fetchTrialDetails(trialId),
        utilityService.fetchStagesOfTrial(trialId)
    ]).then(function(values){

        var patientQueryResult = values[0]; // should be empty
        var trialQueryResult = values[1];   // should not be empty
        var stagesQueryResult = values[2];  // should not be empty

        console.log(patientQueryResult);
        console.log(trialQueryResult);
        console.log(stagesQueryResult);

        var responseObject = {status: "error", "message": '', data: null};
        var responseCode = 500;

        if (patientQueryResult.length === 0) {

            if (trialQueryResult.length === 1) {

                if (stagesQueryResult.length === 1) {

                    const patient = database.sequelize.model('patient');
                    const stage = database.sequelize.model('stage');
                    //const activityInstance = database.sequelize.model('activity_instance');

                    var stageId = stagesQueryResult[0].StageId;
                    console.log(stageId);

                    // TODO - create patient first, then create activityInstances, calculate EndDate

                } else {
                    responseObject.message = "No Trial Stage exist for this trial!";
                }
            } else {
                responseObject.message = "No Such Trial exists!";
            }
        } else {
            responseObject.message = "Patient already exists!";
        }

        return reply(responseObject).code(responseCode);

    }).catch(function(err){
        console.log(err);
        return reply({code: 500, message: 'Something went Wrong!'}).code(500);
    });
}

module.exports = createPatient;
