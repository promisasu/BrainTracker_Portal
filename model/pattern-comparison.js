'use strict';

/**
 * @module model/pattern-comparison
 */

const Sequelize = require('sequelize');

/**
 * Registers model with Sequelize
 * @param {Sequelize} sequelize - database instance
 * @returns {Null} nothing
 */
function register(sequelize){
    /**
     * a patient has many pattern-comparison tasks to take.
     * @typedef  {Object}  pattern-comparison
     * @property {Number} id - finger-tapping id
     * @property {Number} PatientPinFK - related patient's id
     * @property {Number} ActivityInstanceIdFK - related activity_instance's id
     * @property {Number} TotalTimeTaken - Number of seconds taken to complete the task
     * @property {Number} ScreenHeight - Height of the mobile device used for taking task
     * @property {Number} ScreenWidth - Width of the mobile device used for taking task
     * @property {String} answers - json format containing the detail about the questions encountered
     */

    sequelize.define('pattern-comparison', {
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