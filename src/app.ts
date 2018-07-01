var firebase1 = require('../services/firebase.js'),
    request = require('request');
var dateFormat = require('dateformat');

import {
    Promise
} from 'es6-promise';

class App {
    fb: any;
    constructor() {
        this.fb = new firebase1();
        // this.loraineTests();

        // this.shaharTests();


        // this.danaIgraTests();
        // this.test123();
        this.danielYosefTests();

    }
    shaharTests() {
        const mealsReal = {
                'Carpaccio': 2,
                'Ceaser salad': 3,
                'Pappardelle bolognese': 8,
                'Pizza Margherita': 6,
                'Sprite': 6,
                'coca cola 330 ml': 2,
                'home Focaccia': 4
            },
            rawMaterialsReal = {
                'lemon': 20,
                'Arugula': 280,
                basil: 2320,
                'beef meet': 1800,
                'chicken meat': 200,
                'cola': 2,
                'dough': 5000,
                'garlic': 2680,
                lettuce: 200,
                mashrom: 1800,
                mozzarella: 600,
                olivs: 160,
                sprite: 6,
                tomato: 7200
            },
            rawMaterialsPred = {
                'lemon': 20,
                'Arugula': 280,
                basil: 2320,
                'beef meet': 1800,
                'chicken meat': 200,
                'cola': 2,
                'dough': 5000,
                'garlic': 2680,
                lettuce: 200,
                mashrom: 1800,
                mozzarella: 600,
                olivs: 160,
                sprite: 6,
                tomato: 7200
            },
            mealsPred = {
                'Carpaccio': 2,
                'Ceaser salad': 3,
                'Pappardelle bolognese': 8,
                'Pizza Margherita': 6,
                'Sprite': 6,
                'coca cola 330 ml': 2,
                'home Focaccia': 4
            },
            timestamp = 1530854918000;
        const batch = this.fb.db.batch(),
            date = new Date(timestamp);
        const dateDoc = `${date.getFullYear()}` + '-' + `${date.getMonth()}` + '-' + `${date.getDate()}`;
        console.log(dateDoc);
        const day = this.fb.db.doc('/RestAlfa/Rustico-555/YearlyUse/' + `${date.getDay()}` + '/Days/' + dateDoc);
        batch.set(day, {
            mealsPred: mealsPred,
            rawMaterialsPred: rawMaterialsPred,
            // rawMaterialsReal: rawMaterialsReal,
            // mealsReal: mealsReal,
            month: date.getMonth(),
            year: date.getFullYear(),
            timestamp: timestamp
        }, {
            merge: true
        });
        // for (let j = 0; j < 24; j++) {
        //     batch.update(test, {
        //         ['hour' + j]: {
        //             customersReal: 16,
        //             customersPred: 16,
        //         }
        //     });
        // }
        batch.commit().then(() => console.log('success'));

    }

    danielLuzTests() {
        const date = new Date(),
            orderedBy = 'test',
            status = 'active',
            tableObj = {
                size: 5
            },
            instantOrder = true,
            id = 'testing',
            friends = ['a', 'b'];
        date.setHours(date.getHours() - 1);

        this.fb.db.collection('/RestAlfa/kibutz-222/TablesOrders/5/orders').doc().set({
            date: date,
            orderedBy: orderedBy,
            status: status,
            instantOrder: instantOrder,
            id: id,
            friends: friends,
            size: 3,
            tableObj: tableObj

        }).then(console.log('success'));

    }

    loraineTests() {
        console.log(dateFormat(new Date(), `yyyy-mm-dd'T'HH:MM:ss`), );
        let job;
        const sqlQuery = `SELECT * FROM predictions.meal_orders ORDER BY TimeStamp Asc;`,
            options = {
                query: sqlQuery,
                useLegacySql: false
            };
        this.fb.bq.createQueryJob(options).then(results => {
            job = results[0];
            return job.promise();
        }).then(() => {
            // Get the job's status
            return job.getMetadata();
        }).then(metadata => {
            // Check the job's status for errors
            const errors = metadata[0].status.errors;
            if (errors && errors.length > 0) {
                throw errors;
            }
        }).then(() => {
            return job.getQueryResults();
        }).then(results => {
            const rows = results[0];
            for (let row of rows) {
                // console.log(row);
                const mealJson = JSON.parse(row.MealJson);
                console.log(row);
                // console.log(mealJson['burger and fries']['burger']['bun']['rawMaterial']);

            }

        })
    }

    danaIgraTests() {
        const rest = 'RestAlfa',
            restID = 'mozes-333',
            day = '5',
            batch = this.fb.db.batch();
        this.fb.db.doc(rest + '/' + restID + '/restGlobals/predictionParams').get().then(doc => {
            const utc = doc.data().utc,
                currTime = (Date.now()),
                today = new Date(currTime + Number(utc)),
                yearRef = this.fb.db.collection(rest + '/' + restID + '/YearlyUse'),
                todayRef = yearRef.doc(day).collection('Days'),
                week = new Date();
            week.setDate(today.getDate() + 6);
            if (week.getDay() === Number(day)) {

                const hourRef = todayRef.doc((week.getTime()).toString()),
                    realData = [];
                realData[0] = {};
                realData[1] = {};
                realData[2] = [];


                todayRef.orderBy('timestamp').get().then(docs => {
                    let docCounter = 0;
                    docs.forEach(docc => {
                        const data = docc.data();
                        const mealsReal = Object.keys(data.mealsReal),
                            rawMaterialsReal = Object.keys(data.rawMaterialsReal);
                        for (const meal of mealsReal) {
                            if (realData[0][meal]) {
                                realData[0][meal][docCounter] = data.mealsReal[meal];
                            } else {
                                realData[0][meal] = [];
                                realData[0][meal][docCounter] = data.mealsReal[meal];
                            }
                        }
                        for (const rawMat of rawMaterialsReal) {
                            if (realData[1][rawMat]) {
                                realData[1][rawMat][docCounter] = data.rawMaterialsReal[rawMat];
                            } else {
                                realData[1][rawMat] = [];
                                realData[1][rawMat][docCounter] = data.rawMaterialsReal[rawMat];
                            }
                        }
                        docCounter = docCounter + 1;
                        realData[2].push(docCounter);
                    });
                    return docCounter;
                }).then((docCounter) => {
                    batch.set(hourRef, {
                        year: (week.getFullYear()).toString(),
                        month: (week.getMonth()).toString(),
                        date: (week.getDate().toString()),
                        timeStamp: week.getTime()
                    });
                    console.log('0', realData[0]);
                    console.log('1', realData[1]);
                    console.log('2', realData[2]);
                    const keys0 = Object.keys(realData[0]),
                        keys1 = Object.keys(realData[1]);
                    for (const key of keys0) {
                        const xMinXAvg = [],
                            yMinYAvg = [];
                        let xMultYSum = 0,
                            xSquaredSum = 0,
                            ySquaredSum = 0,
                            xAvg = 0,
                            yAvg = 0,
                            xSum = 0,
                            ySum = 0,
                            r = 0,
                            sY = 0,
                            sX = 0,
                            b = 0,
                            a = 0,
                            y = 0;

                        for (let val = 0; val < docCounter; val++) {
                            if (realData[0][key][val]) {
                                ySum += realData[0][key][val];
                            }
                            xSum += realData[2][val];
                        };
                        xAvg = xSum / docCounter;
                        yAvg = ySum / docCounter;

                        for (let val = 0; val < docCounter; val++) {
                            if (realData[0][key][val]) {
                                yMinYAvg[val] = realData[0][key][val] - yAvg;
                            } else {
                                yMinYAvg[val] = -yAvg;
                            }
                            xMinXAvg[val] = realData[2][val] - xAvg;
                        };

                        for (let val = 0; val < docCounter; val++) {
                            //E(x-x^)*(y-y^) => S
                            xMultYSum += xMinXAvg[val] * yMinYAvg[val];
                            //E(x-x^)^2 => C
                            xSquaredSum += Math.pow(xMinXAvg[val], 2);
                            //E(y-y^)^2 => D
                            ySquaredSum += Math.pow(yMinYAvg[val], 2);
                        }

                        // S / Sqrt(C*D)
                        r = xMultYSum / (Math.sqrt((xSquaredSum * ySquaredSum)));

                        //sqrt(C / vars -1)
                        sX = Math.sqrt((xSquaredSum / (docCounter - 1)));

                        //sqrt(D / vars -1)
                        sY = Math.sqrt((ySquaredSum / (docCounter - 1)));
                        b = (r * sY) / sX;

                        a = yAvg - (b * xAvg);
                        y = a + (b * (docCounter + 1));

                        batch.set(hourRef, {
                            mealsPred: {
                                [key]: y
                            }
                        }, {
                            merge: true
                        });
                    }

                    for (const key of keys1) {
                        const xMinXAvg = [],
                            yMinYAvg = [];
                        let xMultYSum = 0,
                            xSquaredSum = 0,
                            ySquaredSum = 0,
                            xAvg = 0,
                            yAvg = 0,
                            xSum = 0,
                            ySum = 0,
                            r = 0,
                            sY = 0,
                            sX = 0,
                            b = 0,
                            a = 0,
                            y = 0;

                        for (let val = 0; val < docCounter; val++) {
                            if (realData[1][key][val]) {
                                ySum += realData[1][key][val];
                            }
                            xSum += realData[2][val];
                        };
                        xAvg = xSum / docCounter;
                        yAvg = ySum / docCounter;

                        for (let val = 0; val < docCounter; val++) {
                            if (realData[1][key][val]) {
                                yMinYAvg[val] = realData[1][key][val] - yAvg;
                            } else {
                                yMinYAvg[val] = -yAvg;
                            }
                            xMinXAvg[val] = realData[2][val] - xAvg;
                        };

                        for (let val = 0; val < docCounter; val++) {
                            //E(x-x^)*(y-y^) => S
                            xMultYSum += xMinXAvg[val] * yMinYAvg[val];
                            //E(x-x^)^2 => C
                            xSquaredSum += Math.pow(xMinXAvg[val], 2);
                            //E(y-y^)^2 => D
                            ySquaredSum += Math.pow(yMinYAvg[val], 2);
                        }

                        // S / Sqrt(C*D)
                        r = xMultYSum / (Math.sqrt((xSquaredSum * ySquaredSum)));

                        //sqrt(C / vars -1)
                        sX = Math.sqrt((xSquaredSum / (docCounter - 1)));

                        //sqrt(D / vars -1)
                        sY = Math.sqrt((ySquaredSum / (docCounter - 1)));
                        b = (r * sY) / sX;

                        a = yAvg - (b * xAvg);
                        y = a + (b * (docCounter + 1));

                        batch.set(hourRef, {
                            rawMaterialsPred: {
                                [key]: y
                            }
                        }, {
                            merge: true
                        });
                    }
                });
            }
        });

    }

    danielYosefTests() {
        const hour = [];
        for(let i=0; i<23; i++) {
            hour['hour'+`${i}`] = {};
        }
        hour['hour0'] = {
                customersReal: 0,
                customersPred: 0
            };
            hour['hour1'] = {
                customersReal: 0,
                customersPred: 0
            };
            hour['hour2'] = {
                customersReal: 0,
                customersPred: 0
            };
            hour['hour3'] = {
                customersReal: 0,
                customersPred: 0
            };
            hour['hour4'] = {
                customersReal: 0,
                customersPred: 0
            };
            hour['hour5'] = {
                customersReal: 0,
                customersPred: 0
            };
            hour['hour6'] = {
                customersReal: 0,
                customersPred: 0
            };
            hour['hour7'] = {
                customersReal: 0,
                customersPred: 0
            };
            hour['hour8'] = {
                customersReal: 0,
                customersPred: 0
            };
            hour['hour9'] = {
                customersReal: 0,
                customersPred: 0
            };
            hour['hour10'] = {
                customersReal: 0,
                customersPred: 0
            };
            hour['hour11'] = {
                customersReal: 3,
                customersPred: 2
            };
            hour['hour12'] = {
                customersReal: 4,
                customersPred: 3
            };
            hour['hour13'] = {
                customersReal: 6,
                customersPred: 4
            };
            hour['hour14'] = {
                customersReal: 10,
                customersPred: 8
            };
            hour['hour15'] = {
                customersReal: 6,
                customersPred: 4
            };
            hour['hour16'] = {
                customersReal: 2,
                customersPred: 1
            };
            hour['hour17'] = {
                customersReal: 0,
                customersPred: 0
            };
            hour['hour18'] = {
                customersReal: 4,
                customersPred: 3
            };
            hour['hour19'] = {
                customersReal: 7,
                customersPred: 5
            };
            hour['hour20'] = {
                customersReal: 10,
                customersPred: 9
            };
            hour['hour21'] = {
                customersReal: 9,
                customersPred: 7
            };
            hour['hour22'] = {
                customersReal: 4,
                customersPred: 5
            };
            hour['hour23'] = {
                customersReal: 0,
                customersPred: 0
            };
            
            const timestamp = 1528608518000,
            batch = this.fb.db.batch(),
            date = new Date(timestamp);
            
        const dateDoc = `${date.getFullYear()}` + '-' + `${date.getMonth()}` + '-' + `${date.getDate()}`;
        console.log(dateDoc);
        const day = this.fb.db.doc('/RestAlfa/Rustico-555/YearlyActivity/' + `${date.getDay()}` + '/Days/' + dateDoc);
        let totalCustomersReal = 0,
        totalCustomersPred = 0;
            for(let i=0; i < 24; i++) {
                totalCustomersReal += hour['hour'+`${i}`].customersReal;
                totalCustomersPred += hour['hour'+`${i}`].customersPred;
                batch.set(day, {
                    ['hour'+`${i}`]: hour['hour'+`${i}`],
                    month: date.getMonth(),
                    year: date.getFullYear(),
                    timestamp: timestamp
                }, {
                    merge: true
                });
            }

            batch.set(day, {
                timestamp: timestamp,
                totalCustomersReal: totalCustomersReal,
                totalCustomersPred: totalCustomersPred
            }, {
                merge: true
            });
        
        batch.commit().then(() => console.log('success'));

    }

}
module.exports = App;
new App();