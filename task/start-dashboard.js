'use strict';

/**
 * @module task/start-dashboard
 * Starts dashboard server.
 */

const processManager = require('pm2');
const path = require('path');
const configuration = require('../config.json');

processManager.connect(() => {
    processManager.start(
        {
            name: `epilepsy-${configuration.environment}-dashboard`,
            script: path.resolve('task', 'helper', 'start-dashboard.js'),
            error_file: path.resolve('logs', `${Date.now()}-epilepsy-${configuration.environment}-dashboard-error.log`),
            out_file: path.resolve('logs', `${Date.now()}-epilepsy-${configuration.environment}-dashboard-out.log`),
            log_date_format: 'x'
        },
        (err) => {
            if (err) {
                console.error(err);
            }
            processManager.disconnect();
        }
    );
});
