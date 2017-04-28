'use strict';

/**
 * @module model/finger-tapping
 */

const Sequelize = require('sequelize');

/**
 * Registers model with Sequelize
 * @param {Sequelize} sequelize - database instance
 * @returns {Null} nothing
 */
function register(sequelize){
    /**
     * a patient has many finger-tapping tasks to take.
     * @typedef {Object} finger-tapping
     * @property {Number} id - finger-tapping id
     * @property {Number} PatientPinFK - related patient's id
     * @property {Number} ActivityInstanceIdFK - related activity_instance's id
     * @property {Number} TimeToTap - Number of seconds to wait before the task begins
     * @property {Number} ScreenHeight - Height of the mobile device used for taking task
     * @property {Number} ScreenWidth - Width of the mobile device used for taking task
     * @property {String} result - json format containing the counts for each hand i.e. left & right
     */

    sequelize.define('finger-tapping', {
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
        TimeToTap: {
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
            type: Sequelize.TEXT,
            allowNull: true
        }
    }, {
        freezeTableName: true,
        paranoid: true
    });
}

module.exports = register;