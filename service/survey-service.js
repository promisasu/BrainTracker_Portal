/*jslint node: true */
'use strict';

// import modules
const database = require('../model');
const moment = require('moment');
const viewDateTimeFormat = "MM-DD-YYYY h:mm a";

// fetch all of the finger-tapping of selected patient
function getFingerTappingCompliance(patientPin){
    var rawQuery =  "SELECT at.activityTitle,at.StartTime,at.EndTime,ft.CreatedAt,ft.ActivityInstanceIdFK, "+
        "TIMESTAMPDIFF(HOUR,ft.CreatedAt,at.EndTime)/ TIMESTAMPDIFF(HOUR,at.StartTime,at.EndTime)*100 as Compliance "+
        "FROM finger_tapping AS ft, patients AS pt, activity_instance AS at, stage AS st, trial AS tr "+
        "WHERE ft.PatientPinFK = pt.PatientPin AND ft.ActivityInstanceIdFK = at.ActivityInstanceId "+
        "AND pt.PatientPin = :pin AND pt.StageIdFK = st.StageId AND st.TrialId = tr.TrialId"

    return database.sequelize.query(rawQuery, {
        replacements: { pin: patientPin },
        type: database.sequelize.QueryTypes.SELECT
    });
}

function getPatternComparisonCompliance(patientPin){

    var rawQuery =  "SELECT at.activityTitle,at.StartTime,at.EndTime,pc.CreatedAt,pc.ActivityInstanceIdFK,"+
    " TIMESTAMPDIFF(HOUR,pc.CreatedAt,at.EndTime)/ TIMESTAMPDIFF(HOUR,at.StartTime,at.EndTime)*100 as Compliance "+
    " FROM pattern_comparison AS pc, patients AS pt, activity_instance AS at, stage AS st, trial AS tr "+
    " WHERE pc.PatientPinFK = pt.PatientPin AND pc.ActivityInstanceIdFK = at.ActivityInstanceId"+
    " AND pt.PatientPin = :pin and pt.StageIdFK = st.StageId AND st.TrialId = tr.TrialId"

    return database.sequelize.query(rawQuery, {
        replacements: { pin: patientPin },
        type: database.sequelize.QueryTypes.SELECT
    });
}


function getFormattedResults(queryResults) {
    queryResults.forEach(function (result){
        result.CreatedAt = moment(result.CreatedAt).format(viewDateTimeFormat);
        result.StartTime = moment(result.StartTime).format(viewDateTimeFormat);
        result.EndTime = moment(result.EndTime).format(viewDateTimeFormat);
        result.Compliance = Math.round(result.Compliance);
    });
    return queryResults;
}



function getChartParamsForActivity(activityResult)
{
    var DataPoints = [];
    var ActivityLabel = "";
    var AxisLabels =[];
    var returnObj ={
            Labels : [],
            activitylabel :[],
            datapoints:[]
        };

    if (activityResult.length > 0) {
        activityResult.forEach(function(attempt){
              if(ActivityLabel === ""){
                ActivityLabel = (attempt.activityTitle);}
            if(attempt.Compliance > 0 && attempt.Compliance < 100 )
            {
                AxisLabels.push(attempt.CreatedAt);
                DataPoints.push(attempt.Compliance);
            }
        });
        returnObj ={
       Labels : AxisLabels,
       activitylabel :ActivityLabel,
       datapoints:DataPoints
       };
    }
    return returnObj;
}




function generateSurveyDataSets(summarySurveyDataSets)
{

    var returnArray =[];
       summarySurveyDataSets.forEach(function(dataset){
           var dataArr =
               {
                   label: dataset.activitylabel,
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
                   data: dataset.datapoints,
                   spanGaps: false,
                   dates:dataset.Labels
               };
           returnArray.push(dataArr);
       });


    return returnArray;
}

function generateSurveySummaryChart(dataArray)
{

    console.log("DEBUG:: inside :: Generating Graph");
  let datasets = dataArray;
  let labels = [];


      console.log("DEBUG:: Length of  datasets ::",datasets.length);
      console.log("DEBUG::TYPE OF::",typeof (datasets[0].data));

      for (let i = 0; i < datasets.length; i++) {
          let dataSet = datasets[i];
          let y = dataSet.data;
          let x = dataSet.dates;
          console.log("DEBUG:: Y of  Data::",y);
          console.log("DEBUG:: X of  dates ::",x);
          datasets[i].data = [];
          for (let j = 0; j < x.length; j++) {
              datasets[i].data.push({
                  'x': x[j],
                  'y': y[j]
              });
          }
          labels.push.apply(labels, dataSet.dates);
      }


    console.log("DEBUG:: inside :: Processed X and Y axis for Graph");
      const numberOfDays = 1;
      const endDateforChart = moment(labels[labels.length - 1]).add(numberOfDays, 'day');
      labels.push(moment(endDateforChart).format(viewDateTimeFormat));


    var chartData = {
        labels: labels,
        datasets: datasets
    };
    console.log("DEBUG:: inside :: Function Exiting");
    return JSON.stringify(chartData);

}


module.exports.fetchFingerTappingCompliance = getFingerTappingCompliance;
module.exports.fetchPatternComparisonCompliance = getPatternComparisonCompliance;
module.exports.fetchFormattedResults = getFormattedResults;
module.exports.fetchChartParamsForActivity = getChartParamsForActivity;
module.exports.fetchSurveySummaryChart = generateSurveySummaryChart;
module.exports.fetchSurveyDataSets = generateSurveyDataSets;