/*jslint node: true */
"use strict";

// import modules
const utilityService = require('../../service/utility-service');

function createPatientView(request, reply){
    Promise.all([
        utilityService.fetchTrialDetails(request.params.id)
    ]).then(function(values){

        return reply.view('enroll-patient', {
            title: 'Epilepsy | Enroll Patient',
            trial: values[0][0]
        });
    }).catch(function(err){
        console.log(err);
        return reply({code: 500, message: 'Something went Wrong!'}).code(500);
    });
}

module.exports = createPatientView;