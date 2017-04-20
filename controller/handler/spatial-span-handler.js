'use strict';

const database = require('../../model');
const moment = require('moment');
const viewDateTimeFormat = "MM-DD-YYYY h:mm a";

function spatialSpanView(request, reply, patientPin){
    // TODO

    reply.view('spatial-span');
}

module.exports = spatialSpanView;