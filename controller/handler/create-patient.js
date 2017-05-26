'use strict';

/**
 * @module controller/handler/create-patient
 */

// import modules
const database = require('../../model');
const utilityService = require('../../service/utility-service');
const moment = require('moment');

// string constants
const viewDateTimeFormat = "MM-DD-YYYY h:mm:ss a";

/**
 * Creates a new Patient
 * @param {Request} request - Hapi request
 * @param {Reply} reply - Hapi Reply
 * @returns {Null} Redirect
 */
function createPatient (request, reply) {
    // import models
    const Patient = database.sequelize.model('patient');
    const Trial = database.sequelize.model('trial');
    const Stage = database.sequelize.model('stage');
    const ActivityInstance = database.sequelize.model('activity-instance');

    const patientPin = request.payload.patientPin;
    const trialId = request.payload.trialId;
    const startDate = request.payload.startDate;

    var responseObject = {status: "error", message: "", data: null};
    var responseCode = 500;

    Promise.all([
        Patient.findById(patientPin),
        Trial.findById(trialId),
        Stage.findAll({
            where: {
                TrialId: trialId
            }
        })
    ]).then(function(values){
        var patientInstance = values[0];
        var trialInstance = values[1];
        var stageInstance = values[2];

        if (patientInstance === null) {
            if (trialInstance !== null) {
                if (stageInstance !== null) {
                    var initialStartDateObject = new Date(startDate);
                    var week1 = getWeekStartAndEndDate(moment.utc(initialStartDateObject), true);
                    console.log(week1);
                    var week2 = getWeekStartAndEndDate(week1.endDate, false);
                    console.log(week2);
                    var week3 = getWeekStartAndEndDate(week2.endDate, false);
                    console.log(week3);
                    var week4 = getWeekStartAndEndDate(week3.endDate, false);
                    console.log(week4);

                    // create patient
                    Patient.create({
                            PatientPin: patientPin, DateStarted: week1.startDate, DateCompleted: week4.endDate,
                            StageIdFK:stageInstance[0].dataValues.StageId, type: 'child'})
                        .then(function(currentPatient){

                            console.log(currentPatient);

                            // TODO bulkCreate activity_instance for trial period


                    }).catch(function(err){
                        console.log(err);
                        responseObject.message = err.message;
                        return reply(responseObject).code(responseCode);
                    });

                    responseObject.message = "ok";
                    responseObject.data = [JSON.stringify(week1), JSON.stringify(week2), JSON.stringify(week3), JSON.stringify(week4)];
                    responseCode = 200;
                } else {
                    responseObject.message = "No Trial Stage exist for this trial!";
                    return reply(responseObject).code(responseCode);
                }
            } else {
                responseObject.message = "No Such Trial exists!";
                return reply(responseObject).code(responseCode);
            }
        } else {
            responseObject.message = "Patient already exists!";
            return reply(responseObject).code(responseCode);
        }
    }).catch(function(err){
        console.log(err);
        return reply({code: 500, message: 'Something went Wrong!, '+err.message}).code(500);
    });
}

function getWeekStartAndEndDate(UTCDate, initialFlag){
    var startDate = null;
    var endDate = null;

    if (initialFlag) {
        startDate = UTCDate.clone();
        endDate = UTCDate.clone().add(6, 'days').hours(23).minutes(59).seconds(59);
    } else {
        startDate = UTCDate.clone().add(1, 'seconds');
        endDate = startDate.clone().add(6, 'days').hours(23).minutes(59).seconds(59);
    }

    return {startDate: startDate, endDate: endDate};
}

function getStageId(stages){
    console.log()
}

module.exports = createPatient;
