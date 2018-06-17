import * as firebase from '../../../lib/firebase.js'
const fb = new firebase();

exports.handler = async (change, context) => {
    const rest = context.params.rest,
        restID = context.params.restID,
        day = context.params.hour,
        batch = fb.db.batch(),
        afterData = change.after.data()

    if (afterData && afterData.mealsReal && Object.keys(afterData.mealsReal).length > 0) {
        fb.db.doc(rest + '/' + restID+'/restGlobals/predictionParams').get().then(doc => {
            const utc = doc.data().utc,
                currTime = (Date.now()),
                today = new Date(currTime + Number(utc)),
                yearRef = fb.db.collection(rest + '/' + restID + '/YearlyUse'),
                todayRef = yearRef.doc(day).collection('Days'),
                week = new Date();
            week.setDate(today.getDate() + 6);
            console.log('week',week.getDay());
            if( week.getDay() === Number(day)) {

                const hourRef = todayRef.doc((week.getTime()).toString()),
                    realData = [];
                    realData[0] = {};
                    realData[1] = {};
                    realData[2] = [];

                return todayRef.orderBy('timestamp').get().then(docs => {
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
                }).then(() => {
                    return batch.commit().then(() => {
                        console.log('updated pred')
                    });
                }).catch(err => {return console.log(err)});
            } else {
                console.log('day should not have changed')
            }
        }).catch(err => {return console.log(err)});
    } else {
        return console.log('nothing changed')
    }
}