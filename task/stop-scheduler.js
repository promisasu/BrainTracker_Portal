'use strict';

/**
 * @module task/stop-scheduler
 * Stops scheduler cron job.
 */

const processManager = require('pm2');
const configuration = require('../config.json');

processManager.connect(() => {
    processManager.delete(
        `epilepsy-${configuration.environment}-scheduler`,
        (err) => {
            if (err) {
                console.error(err);
            }
            processManager.disconnect();
        }
    );
});
