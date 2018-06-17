import * as firebase from '../../../lib/firebase.js'
const fb = new firebase();

exports.handler = async (change, context) => {
    const rest = context.params.rest,
        restID = context.params.restID,
        day = context.params.hour,
        batch = fb.db.batch();

    if (change.after.data() && change.after.data()['hour0'].customersReal) {
        fb.db.doc(rest + '/' + restID + '/restGlobals/predictionParams').get().then(doc => {
            const utc = doc.data().utc,
                currTime = (Date.now()),
                today = new Date(currTime + Number(utc)),
                yearRef = fb.db.collection(rest + '/' + restID + '/YearlyActivity'),
                todayRef = yearRef.doc(day).collection('Days'),
                week = new Date();
            week.setDate(today.getDate() + 6);
            if( week.getDay() === Number(day)) {

                const hourRef = todayRef.doc((week.getTime()).toString()),
                    hours = [];

                for (let k = 0; k < 24; k++) {
                    hours[k] = [];
                }

                todayRef.orderBy('timestamp').get().then(docs => {
                    let docCounter=1;
                    docs.forEach(docc => {
                        const data = docc.data();
                        for (let g = 0; g < 24; g++) {
                            hours[g].push({
                                y: data['hour'+g].customersReal,
                                x: docCounter
                            });
                        }
                        docCounter=docCounter+1;
                    });
                    return docCounter;
                }).then((docCounter) => {
                    batch.set(hourRef, {
                        year: (week.getFullYear()).toString(),
                        month: (week.getMonth()).toString(),
                        date: (week.getDate().toString()),
                        timeStamp: week.getTime()
                    })
                        const yPreds = [];
                        for (let l = 0; l < 24; l++) {
                            const xMinXAvg = [],
                                yMinYAvg = [],
                                length = hours[l].length;

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
                            hours[l].forEach(hour => {
                                    xSum += hour.x;
                                    ySum += hour.y;
                            });

                            xAvg = xSum / length;
                            yAvg = ySum / length;

                            hours[l].forEach(hour => {
                                    //E(x-x^)
                                    xMinXAvg.push(hour.x - xAvg);
                                    //E(y-y^)
                                    yMinYAvg.push(hour.y - yAvg);
                            });

                            for (let z = 0; z < length; z++) {
                                //E(x-x^)*(y-y^) => S
                                xMultYSum += xMinXAvg[z] * yMinYAvg[z];
                                //E(x-x^) => C
                                xSquaredSum += Math.pow(xMinXAvg[z], 2);
                                //E(y-y^) => D
                                ySquaredSum += Math.pow(yMinYAvg[z], 2);
                            }

                            // S / Sqrt(C*D)
                            r = xMultYSum / (Math.sqrt((xSquaredSum * ySquaredSum)));

                            //sqrt(C / vars -1)
                            sX = Math.sqrt((xSquaredSum / (length-1)));

                            //sqrt(D / vars -1)
                            sY = Math.sqrt((ySquaredSum / (length-1)));
                            b = (r * sY) / sX;

                            a = yAvg - (b * xAvg);
                            y = a + (b * (docCounter));
                            yPreds.push(Math.round(y));
                        }
                        batch.update(hourRef,{
                            hour0: {
                                customersPred: yPreds[0]
                            },
                            hour1: {
                                customersPred: yPreds[1]
                            },
                            hour2: {
                                customersPred: yPreds[2]
                            },
                            hour3: {
                                customersPred: yPreds[3]
                            },
                            hour4: {
                                customersPred: yPreds[4]
                            },
                            hour5: {
                                customersPred: yPreds[5]
                            },
                            hour6: {
                                customersPred: yPreds[6]
                            },
                            hour7: {
                                customersPred: yPreds[7]
                            },
                            hour8: {
                                customersPred: yPreds[8]
                            },
                            hour9: {
                                customersPred: yPreds[9]
                            },
                            hour10: {
                                customersPred: yPreds[10]
                            },
                            hour11: {
                                customersPred: yPreds[11]
                            },
                            hour12: {
                                customersPred: yPreds[12]
                            },
                            hour13: {
                                customersPred: yPreds[13]
                            },
                            hour14: {
                                customersPred: yPreds[14]
                            },
                            hour15: {
                                customersPred: yPreds[15]
                            },
                            hour16: {
                                customersPred: yPreds[16]
                            },
                            hour17: {
                                customersPred: yPreds[17]
                            },
                            hour18: {
                                customersPred: yPreds[18]
                            },
                            hour19: {
                                customersPred: yPreds[19]
                            },
                            hour20: {
                                customersPred: yPreds[20]
                            },
                            hour21: {
                                customersPred: yPreds[21]
                            },
                            hour22: {
                                customersPred: yPreds[22]
                            },
                            hour23: {
                                customersPred: yPreds[23]
                            },

                        });
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