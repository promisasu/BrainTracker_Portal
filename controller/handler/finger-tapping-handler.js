/*jslint node: true */
"use strict";

// import modules
const database = require('../../model');
const moment = require('moment');
const viewDateTimeFormat = "MM-DD-YYYY h:mm a";
const fingerTappingService = require('../../service/finger-tapping-service');
const utilityService = require('../../service/utility-service');

function fingerTappingView(request, reply, patientPin){

    Promise.all(
        [
            utilityService.fetchTrialAndPatientIds(patientPin),
            fingerTappingService.fetchAllFingerTapping(patientPin)
        ]
    ).then(function(values){

        var fingerTapping = fingerTappingService.fetchFormattedFingerTapping(values[1]);

        return reply.view('finger-tapping', {
            title: 'Epilepsy | Finger-Tapping',
            breadCrumbData: values[0][0],   // get the first record of trialAndPatientIds Query
            fingerTapping: fingerTapping,
            averageTaps: fingerTappingService.fetchAverageTaps(fingerTapping),
            chartData: fingerTappingService.fetchFingerTappingChartData(fingerTapping),
            activitiesData: fingerTappingService.fetchActivitiesData(fingerTapping)
        });

    }).catch(function(err){
        console.log(err);
        return reply({code: 500, message: 'Something went Wrong!'}).code(500);
    });
}

module.exports = fingerTappingView;
