'use strict';

const patternComparisonPresenter = require('./pattern-comparison-handler');
const fingerTappingPresenter = require('./finger-tapping-handler');
const spatialSpanPresenter = require('./spatial-span-handler');
const flankerTestPresenter = require('./flanker-test-handler');

function patientTaskHandler(request, reply){
    const patientParams = request.params.pin.split('/');
    const patientPin = patientParams[0];
    const patientTask = patientParams[2];

    // TODO -- validate the data-type of patientPin

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
            reply.view('404');

    }
}

module.exports = patientTaskHandler;