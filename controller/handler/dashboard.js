
'use strict';

/**
 * @module controller/handler/dashboard
 */
const processTrial = require('../helper/process-trial');
const database = require('../../model');
const httpNotFound = 404;
const utilityService = require('../../service/utility-service');

/**
 * A dashboard view with overview of all trials and patients.
 * @param {Request} request - Hapi request
 * @param {Reply} reply - Hapi Reply
 * @returns {View} Rendered page
 */
function dashboardView (request, reply) {


    Promise.all([
        utilityService.fetchTrialsForDashboard()
    ]).then(function(values){
        var trialData = values[0].map(processTrial);

        // Display view
        return reply.view('dashboard', {
            title: 'Epilepsy | Dashboard',
            user: request.auth.credentials,
            trials: trialData
        });

    }).catch(function(err){
        console.log(err);
        return reply({code: 500, message: 'Something went Wrong!'}).code(500);
    });
}

module.exports = dashboardView;
