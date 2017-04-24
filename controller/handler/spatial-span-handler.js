/*jslint node: true */
"use strict";

// import service module
var spatialSpanService = require('../../service/spatial-span-service');
var utilityService = require('../../service/utility-service');

function spatialSpanView(request, reply, patientPin){

    Promise.all([
        utilityService.fetchTrialAndPatientIds(patientPin),
        spatialSpanService.fetchAllSpatialSpanActivities(patientPin)
    ]).then(function(values){
        var spatialSpanActivities = spatialSpanService.fetchFormattedSpatialSpanActivities(values[1]);

        return reply.view('spatial-span', {
            title: 'Epilepsy | Spatial Span',
            breadCrumbData: values[0][0],
            spatialSpanActivities: spatialSpanService.fetchSelectListData(spatialSpanActivities),
            chartData: spatialSpanService.fetchSpatialSpanChartData(spatialSpanActivities),
            averageAccuracy: spatialSpanService.fetchAverageAccuracy(spatialSpanActivities),
            activitiesData: spatialSpanService.fetchActivitiesData(spatialSpanActivities)
        });

    }).catch(function(err){
        console.log(err);
        return reply({code: 500, message: 'Something went Wrong!'}).code(500);
    });
}

module.exports = spatialSpanView;