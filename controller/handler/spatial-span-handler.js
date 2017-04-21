//jslint node: true
'use strict';

// import service module
var spatialSpanService = require('../../service/spatial-span-service');

function spatialSpanView(request, reply, patientPin){

    Promise.all([
        spatialSpanService.fetchTrialAndPatientIds(patientPin),
        spatialSpanService.fetchAllSpatialSpanActivities(patientPin)
    ]).then(function(values){
        // TODO -- calculate average accuracy too
        var spatialSpanActivities = spatialSpanService.fetchFormattedSpatialSpanActivities(values[1]);

        return reply.view('spatial-span', {
            title: 'Epilepsy | Spatial Span',
            breadCrumbData: values[0][0],
            spatialSpanActivities: spatialSpanService.fetchSelectListData(spatialSpanActivities),
            chartData: spatialSpanService.fetchSpatialSpanChartData(spatialSpanActivities),
            averageAccuracy: spatialSpanService.fetchAverageAccuracy(spatialSpanActivities),
            activitiesData: spatialSpanActivities.fetchActivitiesData(spatialSpanActivities)
        });

    }).catch(function(err){
        console.log(err);
        return reply({code: 500, message: 'Something went Wrong!'}).code(500);
    });
}

module.exports = spatialSpanView;