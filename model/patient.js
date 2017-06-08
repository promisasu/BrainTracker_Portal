'use strict';

/**
 * @module model/patient
 */

const Sequelize = require('sequelize');
const Stage = require('./stage');
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
     * @typedef {Object} Patient
     * @property {Number} pin - Deindentified representation of a patient
     * @property {String} deviceType - Device Patient registered with
     * @property {String} deviceVersion - OS version of device used to register
     * @property {Date} dateStarted - Date Patient began the Trial
     * @property {Date} dateCompleted - Date Patient completed the Trial
     */
    sequelize.define(
        'patient',
        {
            PatientPin: {
                type: Sequelize.STRING,
                primaryKey: true
            },
            DeviceType: {
                type: Sequelize.ENUM,
                values: ['android', 'ios', 'windows'],
                allowNull: true,
                defaultValue: null
            },
            DeviceVersion: {
                type: Sequelize.STRING,
                validate: {
                    is: /^[a-z0-9. ]+$/
                },
                allowNull: true,
                defaultValue: null
            },
            DateStarted: {
                type: Sequelize.DATE
            },
            DateCompleted: {
                type: Sequelize.DATE
            },
            StageIdFK:{
                type: Sequelize.STRING,
                references: {
                    model: Stage,
                    key: 'StageIdFK'
                }

            },
            ParentPinFK:{
                type: Sequelize.STRING,
                references: {
                    model:Patient,
                    key: 'ParentPinFK',
                    allowNull: true,
                    defaultValue: null
                }
            },
            type:{
                type: Sequelize.ENUM,
                values: ['child','adult','parent_proxy']
            },
            HydroxyureaPrescribed:{
                type: Sequelize.STRING,
                allowNull: true,
                defaultValue: null
            },
            EnhancedContent:{
                type: Sequelize.BOOLEAN,
                allowNull: true,
                defaultValue: false
            }
        },
        {
            freezeTableName: true,
            paranoid: true,
            tableName: 'patients',
            timestamps: false
        }
    );
}

module.exports = register;
