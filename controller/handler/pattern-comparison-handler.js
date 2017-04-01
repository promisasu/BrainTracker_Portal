'use strict';
/**
 * @module controller/handler/pattern-comparison-handler
 */

/**
 * A pattern comparison view with overview of all the pattern comparison tests.
 * @param {Request} request - Hapi request
 * @param {Reply} reply - Hapi Reply
 * @returns {View} Rendered page
 */
function patternComparisonView(request, reply){

    const userParts = request.params.pin.split('/');
    console.log(userParts);

    const patientPin = encodeURIComponent(userParts[0]);
    const patientTask = encodeURIComponent(userParts[1]);

    // TODO check for positive integer type for patientPin and PatientTask == pattern-comparison

    //reply('Hello ' + encodeURIComponent(userParts[0]) + ' ' + encodeURIComponent(userParts[1]) + '!');

    var data = {
        attempts: [
            {
                accuracy: 60,
                averageTime: 4258,
                createdAt: "03/02/2017",
                questions:[
                    {
                        timeTaken: 13624,
                        questionOrder: 1,
                        isCorrect: 1,
                        question: ''
                    },
                    {
                        timeTaken: 1539,
                        questionOrder: 2,
                        isCorrect: 1,
                        question: ''
                    }
                ]
            },
            {
                accuracy: 50,
                averageTime: 2258,
                createdAt: "03/14/2017",
                questions:[
                    {
                        timeTaken: 13624,
                        questionOrder: 1,
                        isCorrect: 1,
                        question: ''
                    },
                    {
                        timeTaken: 1539,
                        questionOrder: 2,
                        isCorrect: 0,
                        question: ''
                    },
                    {
                        timeTaken: 2909,
                        questionOrder: 3,
                        isCorrect: 0,
                        question: ''
                    },
                    {
                        timeTaken: 2018,
                        questionOrder: 4,
                        isCorrect: 0,
                        question: ''
                    },
                    {
                        timeTaken: 1200,
                        questionOrder: 5,
                        isCorrect: 1,
                        question: ''
                    }

                ]
            }
        ]
    };

    reply.view('pattern-comparison', data);

}

module.exports = patternComparisonView;
