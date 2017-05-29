'use strict';

/**
 * @module model/activity-instance
 */

const Sequelize = require('sequelize');
const Patient = require('./patient');

/**
 * Registers model with Sequelize
 * @param {Sequelize} sequelize - database instance
 * @returns {Null} nothing
 */
function register (sequelize) {
    /**
     * a Patient is a person in a Stage of a clinical Trial
     * and is filling out SurveyInstances and QuestionResults
     * @typedef {Object} activity-instance
     * TODO
     */
    sequelize.define(
        'activity-instance',
        {
            ActivityInstanceId: {
                type: Sequelize.INTEGER,
                primaryKey: true
            },
            StartTime: {
                type: Sequelize.DATE,       // DATETIME for mysql
                allowNull: false
            },
            EndTime: {
                type: Sequelize.DATE,
                allowNull: false
            },
            UserSubmissionTime: {
                type: Sequelize.DATE,
                allowNull: true
            },
            ActualSubmissionTime: {
                type: Sequelize.DATE,
                allowNull: true
            },
            State:{
                type: Sequelize.ENUM,
                values: ['pending', 'in progress', 'completed']

            },
            PatientPinFK:{
                type: Sequelize.STRING,
                references: {
                    model: Patient,
                    key: 'PatientPin'
                }
            },
            Sequence:{
                type: Sequelize.STRING,
                allowNull: false
            },
            activityTitle:{
                type: Sequelize.STRING,
                allowNull: false
            },
            description:{
                type: Sequelize.STRING,
                allowNull: false
            }
        },
        {
            freezeTableName: true,
            paranoid: true,
            tableName: 'activity_instance',
            timestamps: true,
            createdAt: 'CreatedAt',
            updatedAt: 'UpdatedAt',
            deletedAt: 'DeletedAt'
        }
    );
}

module.exports = register;