/*jslint node: true */
"use strict";

// import modules
const complianceService = require('../../service/compliance-service');
const utilityService = require('../../service/utility-service');

function surveyComplianceView(request, reply, patientPin){
    Promise.all([
        utilityService.fetchTrialAndPatientIds(patientPin),
        complianceService.fetchPatientComplianceData(patientPin)
    ]).then(function(values){
        var complianceQueryResults = values[1];

        return reply.view('compliance-detail', {
            title: 'Epilepsy | Compliance',
            breadCrumbData: values[0][0],
            complianceChartData: JSON.stringify(complianceService.fetchComplianceChartData(complianceQueryResults)),
            complianceActivities: complianceService.fetchComplianceActivities(complianceQueryResults),
            activitiesStats: complianceService.fetchActivitiesStats(complianceQueryResults)
        });

    }).catch(function(err){
        console.log(err);
        return reply({code: 500, message: 'Something went Wrong!'}).code(500);
    });
}

module.exports = surveyComplianceView;