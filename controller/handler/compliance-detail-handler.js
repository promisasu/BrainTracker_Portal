/*jslint node: true */
"use strict";

// import modules
const complianceService = require('../../service/compliance-service');
const utilityService = require('../../service/utility-service');

function surveyComplianceView(request, reply, patientPin){

    // fetch patient record
    utilityService.fetchPatientRecord(patientPin).then(function(patient){

        // fetch parent's activities
        complianceService.fetchParentActivities(patient[0].ParentPinFK).then(function(parentActivities){

            // fetch child's activities
            complianceService.fetchChildActivities(patient[0].PatientPin).then(function(childActivities){

                // fetch breadCrumbData
                utilityService.fetchTrialAndPatientIds(patientPin).then(function(breadCrumbData){

                    var totalActivities = childActivities.concat(parentActivities);

                    return reply.view('compliance-detail', {
                        title: 'Epilepsy | Compliance',
                        breadCrumbData: breadCrumbData[0],
                        complianceChartData: JSON.stringify(complianceService.fetchComplianceChartData(totalActivities)),
                        complianceActivities: complianceService.fetchComplianceActivities(totalActivities),
                        activitiesStats: complianceService.fetchActivitiesStats(totalActivities)
                    });
                });
            });
        });

    }).catch(function(err){
        console.log(err);
        return reply({code: 500, message: 'Something went Wrong!'}).code(500);
    });
}

module.exports = surveyComplianceView;