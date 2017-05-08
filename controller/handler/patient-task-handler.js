'use strict';

// import modules
const patternComparisonPresenter = require('./pattern-comparison-handler');
const fingerTappingPresenter = require('./finger-tapping-handler');
const spatialSpanPresenter = require('./spatial-span-handler');
const flankerTestPresenter = require('./flanker-test-handler');
const utilityService = require('../../service/utility-service');

function patientTaskHandler(request, reply){
    const patientParams = request.params.pin.split('/');
    const patientPin = patientParams[0];
    const patientTask = patientParams[2];

    // TODO -- validate if patient exists in db or not.

    if (isNaN(parseInt(patientPin))) {
        // invalid patient pin datatype
        console.log('Invalid Patient Pin Data type');
        reply.view('404').code(404);
    } else {

        Promise.all([
            utilityService.fetchPatient(patientPin)
        ]).then(function(values){

            var queryResults = values[0];
            if (queryResults.length === 0) {
                console.log('Np Patient found with pin: ', patientPin);

                return reply.view('404').code(404);
            } else {
                switch (patientTask){
                    case 'pattern-comparison':
                        patternComparisonPresenter(request, reply, patientPin);
                        break;

                    case 'finger-tapping':
                        fingerTappingPresenter(request, reply, patientPin);
                        break;

                    case 'spatial-span':
                        spatialSpanPresenter(request, reply, patientPin);
                        break;

                    case 'flanker-test':
                        flankerTestPresenter(request, reply, patientPin);
                        break;

                    default:
                        console.log('Invalid Activity Selected: ', patientTask);
                        reply.view('404');
                }
            }
        });
    }
}

module.exports = patientTaskHandler;