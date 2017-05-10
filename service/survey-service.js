/*jslint node: true */
'use strict';

// import modules
const database = require('../model');
const moment = require('moment');
const viewDateTimeFormat = "MM-DD-YYYY h:mm a";

/**
* Takes in a patient PIN and get the % time left to complete this  Activity
* @param {Object} patientPin - list of survey instances
* @returns {Object} Results with computed compliance data
*/
function getFingerTappingCompliance(patientPin){
    var rawQuery =  "SELECT at.activityTitle,at.StartTime,at.EndTime,ft.CreatedAt,ft.ActivityInstanceIdFK, "+
        "TIMESTAMPDIFF(HOUR,ft.CreatedAt,at.EndTime)/ TIMESTAMPDIFF(HOUR,at.StartTime,at.EndTime)*100 as Compliance "+
        "FROM finger_tapping AS ft, patients AS pt, activity_instance AS at, stage AS st, trial AS tr "+
        "WHERE ft.PatientPinFK = pt.PatientPin AND ft.ActivityInstanceIdFK = at.ActivityInstanceId "+
        "AND pt.PatientPin = :pin AND pt.StageIdFK = st.StageId AND st.TrialId = tr.TrialId order by ft.CreatedAt asc"

    return database.sequelize.query(rawQuery, {
        replacements: { pin: patientPin },
        type: database.sequelize.QueryTypes.SELECT
    });
}
/**
 * Takes in a patient PIN and get the % time left to complete this  Activity
 * @param {Object} patientPin - list of survey instances
 * @returns {Object} Results with computed compliance data
 */
function getPatternComparisonCompliance(patientPin){

    var rawQuery =  "SELECT at.activityTitle,at.StartTime,at.EndTime,pc.CreatedAt,pc.ActivityInstanceIdFK,"+
    " TIMESTAMPDIFF(HOUR,pc.CreatedAt,at.EndTime)/ TIMESTAMPDIFF(HOUR,at.StartTime,at.EndTime)*100 as Compliance "+
    " FROM pattern_comparison AS pc, patients AS pt, activity_instance AS at, stage AS st, trial AS tr "+
    " WHERE pc.PatientPinFK = pt.PatientPin AND pc.ActivityInstanceIdFK = at.ActivityInstanceId"+
    " AND pt.PatientPin = :pin and pt.StageIdFK = st.StageId AND st.TrialId = tr.TrialId order by pc.CreatedAt asc"

    return database.sequelize.query(rawQuery, {
        replacements: { pin: patientPin },
        type: database.sequelize.QueryTypes.SELECT
    });
}

/**
 * Takes in a patient PIN and get Survey Instance
 * @param {Object} patientPin - list of survey instances
 * @returns {Object} Results with computed compliance data
 */
function getSurveyInstance(patientPin){

    var rawQuery =  "SELECT pa.DateCompleted, si.ActivityInstanceId, si.StartTime, si.EndTime, si.UserSubmissionTime, "+
        "si.ActualSubmissionTime, si.activityTitle,si.State as state, st.Name AS stageName "+
    " FROM patients AS pa  "+
    " JOIN activity_instance AS si "+
    " ON si.PatientPinFK = pa.PatientPin "+
    " JOIN stage AS st "+
    " ON st.StageId = pa.StageIdFK "+
    " WHERE si.activityTitle in ('Epilepsy Weekly Survey','Epilepsy Daily Survey') AND "+
    " pa.PatientPin = :pin ORDER BY si.StartTime "

    return database.sequelize.query(rawQuery, {
        replacements: { pin: patientPin },
        type: database.sequelize.QueryTypes.SELECT
    });
}

/**
 * Takes in a patient PIN and get the % time left to complete this  Activity
 * @param {Object} patientPin - list of survey instances
 * @returns {Object} Results with computed compliance data
 */
function getFlankerCompliance(patientPin){

    var rawQuery = " SELECT at.activityTitle,at.StartTime,at.EndTime,ft.CreatedAt,ft.ActivityInstanceIdFK, "+
        " TIMESTAMPDIFF(HOUR,ft.CreatedAt,at.EndTime)/ TIMESTAMPDIFF(HOUR,at.StartTime,at.EndTime)*100 as Compliance "+
        " FROM flanker AS ft, patients AS pt, activity_instance AS at, stage AS st, trial AS tr "+
        " WHERE ft.PatientPinFK = pt.PatientPin AND ft.ActivityInstanceIdFK = at.ActivityInstanceId "+
        " AND pt.PatientPin = :pin and pt.StageIdFK = st.StageId AND st.TrialId = tr.TrialId "

    return database.sequelize.query(rawQuery, {
        replacements: { pin: patientPin },
        type: database.sequelize.QueryTypes.SELECT
    });
}

/**
 * Takes in a patient PIN and get the % time left to complete this  Activity
 * @param {Object} patientPin - list of survey instances
 * @returns {Object} Results with computed compliance data
 */
function getSpatialSpanCompliance(patientPin){

    var rawQuery = " SELECT at.activityTitle,at.StartTime,at.EndTime,ss.CreatedAt,ss.ActivityInstanceIdFK, "+
        " TIMESTAMPDIFF(HOUR,ss.CreatedAt,at.EndTime)/ TIMESTAMPDIFF(HOUR,at.StartTime,at.EndTime)*100 as Compliance "+
        " FROM spatial_span AS ss, patients AS pt, activity_instance AS at, stage AS st, trial AS tr "+
        " WHERE ss.PatientPinFK = pt.PatientPin AND ss.ActivityInstanceIdFK = at.ActivityInstanceId "+
        " AND pt.PatientPin = :pin and pt.StageIdFK = st.StageId AND st.TrialId = tr.TrialId "

    return database.sequelize.query(rawQuery, {
        replacements: { pin: patientPin },
        type: database.sequelize.QueryTypes.SELECT
    });
}

/**
 * Takes query results and converts the DateTime to desired format and rounds off the Compliance calculated.
 * @param {Object}resyult object of the comploiance calculation query.
 * @returns {Object} Results with computed compliance data
 */
function getFormattedResults(queryResults) {
    queryResults.forEach(function (result){
        result.CreatedAt = moment(result.CreatedAt).format(viewDateTimeFormat);
        result.StartTime = moment(result.StartTime).format(viewDateTimeFormat);
        result.EndTime = moment(result.EndTime).format(viewDateTimeFormat);
        result.Compliance = Math.round(result.Compliance);
    });
    return queryResults;
}

/**
 * Takes formatted query results during compliance calculation and makes the parameters graph friendly
 * Also it checks to have the compliance value between 0 and 100
 * @param {Object} results object whose compliance is known
 * @returns {Object} Array with parameters to display on charts
 */
function getChartParamsForActivity(activityResult) {
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

/**
 * Creates datasets to display on graph
 * @param {Object} DataSets of all the activities
 * @returns {Object} Array with datasets of all activities configured to display on linegraph
 */
function generateSurveyDataSets(summarySurveyDataSets)
{
    var returnArray =[];
    let i = 0;
       summarySurveyDataSets.forEach(function(dataset){
           var dataArr =
               {
                   label: dataset.activitylabel,
                   fill: false,
                   lineTension: 0.1,
                   backgroundColor: getGraphColor(i),
                   borderColor: getGraphColor(i),
                   borderCapStyle: 'butt',
                   borderDash: [],
                   borderDashOffset: 0.0,
                   borderJoinStyle: 'miter',
                   pointBorderColor: getGraphColor(i),
                   pointBackgroundColor: "#fff",
                   pointBorderWidth: 1,
                   pointHoverRadius: 5,
                   pointHoverBackgroundColor: getGraphColor(i),
                   pointHoverBorderColor: "rgba(220,220,220,1)",
                   pointHoverBorderWidth: 2,
                   pointRadius: 1,
                   pointHitRadius: 10,
                   data: dataset.datapoints,
                   spanGaps: false,
                   dates:dataset.Labels
               };
           returnArray.push(dataArr);
           i++;
       });
    return returnArray;
}

//get RGB values
function getGraphColor(index){
    switch(index) {
        case 0:
            return "rgb(65, 244, 79)";
        case 1:
            return "rgb(244, 65, 133)";
        case 2:
            return "rgb(244, 232, 66)";
        case 3:
          return "rgb(45, 69, 244)";
        case 4:
            return "rgb(220, 65, 244,1)";
        case 5:
            return "rgb(65, 244, 79,1)";
        case 6:
            return "rgb(244, 65, 133,1)";
        default:
            return "rgb(231,65,60,1)";
    }
}

/**
 * Takes all the activity's data and makes the final array for the view.
 * @param {Object} datasets to normalize x axis and form one single dataset.
 * @returns {Object} Chart Data to send to the view.
 */
function generateSurveySummaryChart(dataArray)
{
  let datasets = dataArray;
  let labels = [];

      for (let i = 0; i < datasets.length; i++) {
          let dataSet = datasets[i];
          let y = dataSet.data;
          let x = dataSet.dates;
          datasets[i].data = [];
          for (let j = 0; j < x.length; j++) {
              datasets[i].data.push({
                  'x': x[j],
                  'y': y[j]
              });
          }
          labels.push.apply(labels, dataSet.dates);
      }
      const numberOfDays = 1;
      const endDateforChart = moment(labels[labels.length - 1]).add(numberOfDays, 'day');
      labels.push(moment(endDateforChart).format(viewDateTimeFormat));

    var chartData = {
        labels: labels,
        datasets: datasets
    };
    return JSON.stringify(chartData);
}

module.exports.fetchFingerTappingCompliance = getFingerTappingCompliance;
module.exports.fetchPatternComparisonCompliance = getPatternComparisonCompliance;
module.exports.fetchFormattedResults = getFormattedResults;
module.exports.fetchChartParamsForActivity = getChartParamsForActivity;
module.exports.fetchSurveySummaryChart = generateSurveySummaryChart;
module.exports.fetchSurveyDataSets = generateSurveyDataSets;
module.exports.fetchFlankerCompliance = getFlankerCompliance;
module.exports.fetchSpatialSpanCompliance= getSpatialSpanCompliance;
module.exports.fetchSurveyInstance = getSurveyInstance