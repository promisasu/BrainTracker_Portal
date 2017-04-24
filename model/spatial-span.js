'use strict';

/**
 * @module model/trial
 */

const Sequelize = require('sequelize');

/**
 * Registers model with Sequelize
 * @param {Sequelize} sequelize - database instance
 * @returns {Null} nothing
 */

/**
 * a patient has many finger-tapping tasks to take.
 * @typedef {Object}  spatial-span
 * @property {Number} id - finger-tapping id
 * @property {Number} PatientPinFK - related patient's id
 * @property {Number} ActivityInstanceIdFK - related activity_instance's id
 * @property {Number} TimeToComplete - time taken to complete the activity
 * @property {Number} ScreenHeight - Height of the mobile device used for taking task
 * @property {Number} ScreenWidth - Width of the mobile device used for taking task
 * @property {String} result - json format containing an array of objects where each object has difficulty and result property
 */
function register(sequelize){
    sequelize.define('spatial-span', {
        id:{
            type:Sequelize.INTEGER,
            primaryKey: true
        },
        PatientPinFK: {
            type: Sequelize.STRING,
            allowNull: false
        },
        ActivityInstanceIdFK: {
            type: Sequelize.INTEGER,

        },
        TimeToComplete: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        ScreenHeight: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        ScreenWidth: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        result: {
            type: Sequelize.STRING,
            allowNull: true
        }
    }, {
        freezeTableName: true,
        paranoid: true
    });
}

module.exports = register;