'use strict';

/**
 * @module controller/handler/create-patient
 */

// import modules
const database = require('../../model');
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

    var responseObject = {status: "error", message: "", data: null};
    var responseCode = 500;

    Promise.all([
        Patient.findById(request.payload.patientPin),
        Trial.findById(request.payload.trialId),
        Stage.findAll({
            where: {
                TrialId: request.payload.trialId
            }
        })
    ]).then(function(values){
        var patientInstance = values[0];
        var trialInstance = values[1];
        var stageInstance = values[2];

        if (patientInstance === null) {
            if (trialInstance !== null) {
                if (stageInstance !== null) {
                    var weeklyDates = getWeeklyDates(request.payload.startDate);

                    // TODO -- patient and activityInstance creation should be in a transaction

                    // create patient
                    Patient.create({
                        PatientPin: request.payload.patientPin, DeviceType: 'android', DateStarted: weeklyDates.week1.startDate,
                        DateCompleted: weeklyDates.week4.endDate, StageIdFK:stageInstance[0].dataValues.StageId, type: 'child'})
                    .then(function(currentPatient){

                        var instances = generateActivityInstances(weeklyDates, currentPatient.dataValues.PatientPin);

                        //bulkCreate activity_instance for trial period
                        ActivityInstance.bulkCreate(instances).then(function(){

                            responseObject.status = "success";
                            responseObject.message = "Patient Enrolled Successfully!";
                            responseCode = 200;

                            return reply(responseObject).code(responseCode);
                        }).catch(function(err){
                            console.log(err);
                            responseObject.message = err.message;

                            return reply(responseObject).code(responseCode);
                        });
                    }).catch(function(err){
                        console.log(err);
                        responseObject.message = err.message;

                        return reply(responseObject).code(responseCode);
                    });
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

function getWeeklyDates(startDateParam){
    // dates for four weeks are calculated as the trial is for 1 month
    var initialStartDateObject = new Date(startDateParam);

    var week1 = getWeekStartAndEndDate(moment.utc(initialStartDateObject), true);
    var week2 = getWeekStartAndEndDate(week1.endDate, false);
    var week3 = getWeekStartAndEndDate(week2.endDate, false);
    var week4 = getWeekStartAndEndDate(week3.endDate, false);

    return {week1: week1, week2: week2, week3: week3, week4: week4};
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

function generateActivityInstances(weeklyDates, patientPin){
    var activityInstances = [];

    var activitiesSequence = [
        {"sequence":["PATTERNCOMPARISON"],"parentactivity":"PATTERNCOMPARISON"},
        {"sequence":["FINGERTAPPING"],"parentactivity":"FINGERTAPPING"},
        {"sequence":["SPATIALSPAN"],"parentactivity":"SPATIALSPAN"},
        {"sequence":["FLANKER"],"parentactivity":"FLANKER"},
        {"sequence":["PI_WEEKLY","PR_Fatigue","PR_PhysFuncMob","PR_PainInt","PR_Anxiety","CAT"],"parentactivity":"CA2"}
    ];

    for(var property in weeklyDates){
        if (weeklyDates.hasOwnProperty(property)){

            // pattern-comparison activity
            activityInstances.push({
                StartTime: weeklyDates[property].startDate, EndTime: weeklyDates[property].endDate,
                State: 'pending', PatientPinFK: patientPin, Sequence: JSON.stringify(activitiesSequence[0]),
                activityTitle: 'Pattern-Comparison', description: 'Weekly Activity for Epilepsy Patients'
            });

            // finger-tapping activity
            activityInstances.push({
                StartTime: weeklyDates[property].startDate, EndTime: weeklyDates[property].endDate,
                State: 'pending', PatientPinFK: patientPin, Sequence: JSON.stringify(activitiesSequence[1]),
                activityTitle: 'Finger-Tapping', description: 'Weekly Activity for Epilepsy Patients'
            });

            // spatial-span activity
            activityInstances.push({
                StartTime: weeklyDates[property].startDate, EndTime: weeklyDates[property].endDate,
                State: 'pending', PatientPinFK: patientPin, Sequence: JSON.stringify(activitiesSequence[2]),
                activityTitle: 'Spatial-Span', description: 'Weekly Activity for Epilepsy Patients'
            });

            // flanker-test activity
            activityInstances.push({
                StartTime: weeklyDates[property].startDate, EndTime: weeklyDates[property].endDate,
                State: 'pending', PatientPinFK: patientPin, Sequence: JSON.stringify(activitiesSequence[3]),
                activityTitle: 'Flanker-Test', description: 'Weekly Activity for Epilepsy Patients'
            });

            // weekly-survey activity
            activityInstances.push({
                StartTime: weeklyDates[property].startDate, EndTime: weeklyDates[property].endDate,
                State: 'pending', PatientPinFK: patientPin, Sequence: JSON.stringify(activitiesSequence[4]),
                activityTitle: 'Epilepsy Weekly Survey', description: 'Weekly Activity for Epilepsy Patients'
            });

        }
    }

    return activityInstances;
}

module.exports = createPatient;
