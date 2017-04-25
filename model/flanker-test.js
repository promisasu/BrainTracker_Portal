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
function register(sequelize){
    /**
     * a patient has many flanker-test tasks to take.
     * @typedef {Object}  flanker-test
     * @property {Number} id - flanker-test id
     * @property {Number} PatientPinFK - related patient's id
     * @property {Number} ActivityInstanceIdFK - related activity_instance's id
     * @property {Number} TotalTimeTaken - Number of Seconds taken to complete the task
     * @property {Number} ScreenHeight - Height of the mobile device used for taking task
     * @property {Number} ScreenWidth - Width of the mobile device used for taking task
     * @property {String} answers - json format containing the detail about each question encountered in task
     */

    sequelize.define('flanker-test', {
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
        TotalTimeTaken: {
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
        answers: {
            type: Sequelize.TEXT,
            allowNull: true
        }
    }, {
        freezeTableName: true,
        paranoid: true
    });
}

module.exports = register;