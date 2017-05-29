'use strict';

/**
 * @module model/stage
 */

const Sequelize = require('sequelize');
const Trial = require('./trial');

/**
 * Registers model with Sequelize
 * @param {Sequelize} sequelize - database instance
 * @returns {Null} nothing
 */
function register (sequelize) {
    /**
     * A Stage represents a group of Patients' state in a Trial
     * @typedef {Object} Stage
     * @property {String} name - name of the Stage
     */

    sequelize.define(
        'stage',
        {
            StageId:{
                type: Sequelize.STRING,
                primaryKey: true
            },
            Name: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true
                }
            },
            TrialId:{
                type: Sequelize.INTEGER,
                references:{
                    // This is a reference to another model
                    model: Trial,

                    // column name of the referenced Table
                    key: 'TrialId'
                }
            }
        },
        {
            freezeTableName: true,
            paranoid: true,
            tableName: "stage"
        }
    );
}

module.exports = register;
