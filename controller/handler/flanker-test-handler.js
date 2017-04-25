/*jslint node: true */
"use strict";

// import modules
const flankerTestService = require('../../service/flanker-test-service');
const utilityService = require('../../service/utility-service');

function flankerTestView(request, reply, patientPin){
    // TODO

    reply.view('flanker-test');
}

module.exports = flankerTestView;