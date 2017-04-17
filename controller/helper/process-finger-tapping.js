'use strict';

/**
 * @module controller/helper/process-finger-tapping
 */

const moment = require('moment');

const sqlDateFormat = 'ddd MMM DD YYYY HH:mm:ss ZZ';
const viewDateFormat = 'MM-DD-YYYY HH:mm';

/**
 * Takes in a fingerTapping and processes it to get finger tapping chart details
 * @param {Array<Object>} surveys - list of survey instances
 * @returns {Object} Complience chart data
 */
function processFingerTapping (surveys) {
    console.log("Started from Finger tapping Block");


    var labels =[];
    var rightHanddata= [];
    var leftHanddata= [];
    var returnArray= [];
    var dataSet =[];
    for(var i = 0; i < surveys.length && i < 5; i++) {
        var obj = surveys[i];

        console.log("Labels ::"+moment(obj.CreatedAt).format('MM-DD-YYYY HH:mm'));
        labels.push(moment(obj.CreatedAt).format('MM-DD-YYYY HH:mm'));

        var resObj =(surveys[i].result);
        var resJSON = resObj;
        rightHanddata.push(JSON.parse(resJSON).right);
        leftHanddata.push(JSON.parse(resJSON).left);
    }

    returnArray.push(labels);
    returnArray.push(rightHanddata);
    returnArray.push(leftHanddata);

    if(labels.length< 5 && rightHanddata.length < 5 && leftHanddata.length < 5 )
    {
        for(var i = labels.length; i < 5; i++)
        {
            labels.push(moment().toDate().format('MM-DD-YYYY HH:mm'));
            rightHanddata.push(0);
            leftHanddata.push(0);
        }
    }


    console.log("RIGHT HAND::",rightHanddata.toString());
    console.log("LEFT HAND ::",leftHanddata.toString());
    console.log("RETURN ARRAY::",returnArray.toString());

    var rightDataArry = {
        label: 'Right',
        backgroundColor : "rgba(44, 62, 80,0.5)",
        data: rightHanddata
    }

    var leftDataArry = {
        label: 'Left',
        backgroundColor : "rgba(231, 76, 60,0.5)",
        data: leftHanddata
    }

    dataSet.push(rightDataArry);
    dataSet.push(leftDataArry);

    return {
        labels: labels,
        datasets: dataSet
    };

}


module.exports = processFingerTapping;
