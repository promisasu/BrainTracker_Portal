/*jslint node: true */
'use strict';

// import modules
const database = require('../model');
const moment = require('moment');
const viewDateTimeFormat = "MM-DD-YYYY h:mm a";

// fetch all of the finger-tapping of selected patient
function getAllTapsForSurvey(patientPin){
    var rawQuery =  "SELECT at.activityTitle,at.StartTime,at.EndTime,ft.CreatedAt,ft.ActivityInstanceIdFK,"+
        "TIMESTAMPDIFF(HOUR,ft.CreatedAt,at.EndTime)/ TIMESTAMPDIFF(HOUR,at.StartTime,at.EndTime)*100 as Accuracy "+
        "FROM finger_tapping AS ft, patients AS pt, activity_instance AS at, stage AS st, trial AS tr"+
        "WHERE ft.PatientPinFK = pt.PatientPin AND ft.ActivityInstanceIdFK = at.ActivityInstanceId"+
        "AND pt.PatientPin = :pin AND pt.StageIdFK = st.StageId AND st.TrialId = tr.TrialId"

    return database.sequelize.query(rawQuery, {
        replacements: { pin: patientPin },
        type: database.sequelize.QueryTypes.SELECT
    });
}

function getFormattedResults(queryResults) {

    queryResults.forEach(function (tap){
        tap.CreatedAt = moment(tap.CreatedAt).format(viewDateTimeFormat);
        tap.StartTime = moment(tap.StartTime).format(viewDateTimeFormat);
        tap.EndTime = moment(tap.EndTime).format(viewDateTimeFormat);
        tap.Accuracy = Math.round(tap.Accuracy);
    });
    return queryResults;
}



function getChartParamsForFingerTapping(fingerTapping)
{
    var fingerTappingDataPoints = [];
    var fingerTappingActivityLabel =[];
    var fingerTappingAxisLabels =[];

    if (fingerTapping.length > 0) {
        fingerTapping.forEach(function(attempt){

            if (!attempt.activityTitle in fingerTappingActivityLabel) {
                fingerTappingActivityLabel.push(attempt.activityTitle);
            }
            if(attempt.Accuracy > 0 && attempt.Accuracy < 100 )
            {
                fingerTappingAxisLabels.push(attempt.CreatedAt);
                fingerTappingDataPoints.push(attempt.Accuracy);
            }
        }

        );
       var returnObj ={
       Labels : fingerTappingAxisLabels,
       activitylabel :fingerTappingActivityLabel,
       dataponits:fingerTappingDataPoints
       };
       return returnObj;
    }

}

function generateSurveySummaryChart(fingerTappingData)
{
    var chartData = {
        labels: [],
        datasets: [
            {
                label: fingerTappingData.fingerTappingActivityLabel,
                fill: false,
                lineTension: 0.1,
                backgroundColor: "rgba(231,76,60,0.4)",
                borderColor: "rgba(231,76,60,1)",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "rgba(231,76,60,1)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(231,76,60,1)",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: fingerTappingData.fingerTappingDataPoints,
                spanGaps: false
            }]
    };

    chartData.labels.push(fingerTappingData.Labels);



    return JSON.stringify(chartData);

}


module.exports.fetchAllTapsForSurvey = getAllTapsForSurvey;
module.exports.fetchFormattedResults = getFormattedResults;
module.exports.fetchChartParamsForFingerTapping = getChartParamsForFingerTapping;
module.exports.fetchSurveySummaryChart = generateSurveySummaryChart;