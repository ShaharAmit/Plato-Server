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
        // this.test987();
    }
    shaharTests() {
        const batch = this.fb.db.batch();
        const day = this.fb.db.collection('/RestAlfa/kibutz-222/YearlyActivity'),
            timestamp = 1528787520000;
        const test = this.fb.db.doc('/RestAlfa/kibutz-222/YearlyActivity/' + `2` + '/Days/' + timestamp.toString());
        batch.set(test, {
            month: 5,
            year: 2018,
            timestamp: timestamp
        });
        for (let j = 0; j < 24; j++) {
            batch.update(test, {
                ['hour' + j]: {
                    customersReal: 16,
                    customersPred: 16,
                }
            });
        }

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
        console.log(dateFormat(new Date(), `yyyy-mm-dd'T'HH:MM:ss`),
    );
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
        const rest= 'RestAlfa',
            restID = 'mozes-333',
            day='5',
            batch = this.fb.db.batch();
        this.fb.db.doc(rest + '/' + restID+'/restGlobals/predictionParams').get().then(doc => {
            const utc = doc.data().utc,
                currTime = (Date.now()),
                today = new Date(currTime + Number(utc)),
                yearRef = this.fb.db.collection(rest + '/' + restID + '/YearlyUse'),
                todayRef = yearRef.doc(day).collection('Days'),
                week = new Date();
            week.setDate(today.getDate() + 6);
            if( week.getDay() === Number(day)) {

                const hourRef = todayRef.doc((week.getTime()).toString()),
                    realData = [];
                realData[0] = {};
                realData[1] = {};
                realData[2] = [];


                todayRef.orderBy('timestamp').get().then(docs => {
                    let docCounter=0;
                    docs.forEach(docc => {
                        const data = docc.data();
                        const mealsReal = Object.keys(data.mealsReal),
                            rawMaterialsReal = Object.keys(data.rawMaterialsReal);
                        for(const meal of mealsReal) {
                            if(realData[0][meal]) {
                                realData[0][meal][docCounter]=data.mealsReal[meal];
                            } else {
                                realData[0][meal] = [];
                                realData[0][meal][docCounter]=data.mealsReal[meal];
                            }
                        }
                        for(const rawMat of rawMaterialsReal) {
                            if(realData[1][rawMat]) {
                                realData[1][rawMat][docCounter] = data.rawMaterialsReal[rawMat];
                            } else {
                                realData[1][rawMat] = [];
                                realData[1][rawMat][docCounter] = data.rawMaterialsReal[rawMat];
                            }
                        }               
                        docCounter=docCounter+1;
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
                    console.log('0',realData[0]);
                    console.log('1',realData[1]);
                    console.log('2',realData[2]);
                    const keys0 = Object.keys(realData[0]),
                        keys1 = Object.keys(realData[1]);
                    for(const key of keys0) {
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

                        for(let val=0; val<docCounter; val++) {
                            if(realData[0][key][val]) {
                                ySum +=realData[0][key][val];
                            }
                            xSum+=realData[2][val];
                        };
                        xAvg = xSum / docCounter;
                        yAvg = ySum / docCounter;

                        for(let val=0; val<docCounter; val++) {
                            if(realData[0][key][val]) {
                                yMinYAvg[val] = realData[0][key][val] - yAvg;
                            } else {
                                yMinYAvg[val] = -yAvg;
                            }
                            xMinXAvg[val] = realData[2][val] - xAvg;
                        };

                        for (let val=0; val<docCounter; val++) {
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
                        sX = Math.sqrt((xSquaredSum / (docCounter-1)));

                        //sqrt(D / vars -1)
                        sY = Math.sqrt((ySquaredSum / (docCounter-1)));
                        b = (r * sY) / sX;

                        a = yAvg - (b * xAvg);
                        y = a + (b * (docCounter+1));

                        batch.set(hourRef,{
                            mealsPred: {
                                [key]: y
                            }
                        },{merge: true});
                    }

                    for(const key of keys1) {
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

                        for(let val=0; val<docCounter; val++) {
                            if(realData[1][key][val]) {
                                ySum +=realData[1][key][val];
                            }
                            xSum+=realData[2][val];
                        };
                        xAvg = xSum / docCounter;
                        yAvg = ySum / docCounter;

                        for(let val=0; val<docCounter; val++) {
                            if(realData[1][key][val]) {
                                yMinYAvg[val] = realData[1][key][val] - yAvg;
                            } else {
                                yMinYAvg[val] = -yAvg;
                            }
                            xMinXAvg[val] = realData[2][val] - xAvg;
                        };

                        for (let val=0; val<docCounter; val++) {
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
                        sX = Math.sqrt((xSquaredSum / (docCounter-1)));

                        //sqrt(D / vars -1)
                        sY = Math.sqrt((ySquaredSum / (docCounter-1)));
                        b = (r * sY) / sX;

                        a = yAvg - (b * xAvg);
                        y = a + (b * (docCounter+1));

                        batch.set(hourRef,{    
                            rawMaterialsPred: {
                                [key]: y
                            }
                        },{merge: true});
                    }
                });
            }
        });

    }

    danielYosefTests() {
        const rawMaterialsPred = {
            bun: 300,
            test: 500
        },
        // const mealsReal = {
        //     'burger and fries': 15,
        //     'salad moz' : 7.5

        // },
        

        // rawMaterialsReal = {
        //     'bun': 15,
        //     'cola': 15,
        //     'fat': 300,
        //     'lettuce': 540,
        //     'mince': 4400,
        //     'onion': 440,
        //     'potato': 360,
        //     'tomato': 440
        // },
        
        timestamp = new Date(),
        batch = this.fb.db.batch(),

        ref = this.fb.db.collection('/RestAlfa/kibutz-222/YearlyUse');
        for(let day = 0; day<7; day++) {
            let date = new Date();
            date.setDate(timestamp.getDate() + day);
            const dayRef = ref.doc(`${day}`),
                tempRef = dayRef.collection('Days').doc(`${date.getTime()}`);
            batch.set(dayRef,{day:day});
            batch.set(tempRef,{
                rawMaterialsPred: rawMaterialsPred,
                timestamp: date.getTime()
            });
        }
        batch.commit().then(() => {
            console.log('succed');
        })

    }

    test123() {
            const batch = this.fb.db.batch();

        for(let i=0; i<7; i++) {
            const yearRef = this.fb.db.collection('RestAlfa/mozes-333/YearlyUse').doc(`${i}`);
            batch.set(yearRef,{day: i})
        } 

        batch.commit().then(() => console.log('success'))
    }

    test987() {
        const Rank1 =0,
            Rank2 = 0,
            Rank3 = 8,
            ref = this.fb.db.doc('RestAlfa/kibutz-222/MealsRanking/schnitzel and fries');
            ref.set({
                Rank1: Rank1,
                Rank2: Rank2,
                Rank3: Rank3
            }).then(()=>console.log('success')).catch(err => console.log(err));

    }


}
module.exports = App;
new App();