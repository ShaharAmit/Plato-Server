import * as firebase from '../../../lib/firebase.js'
const fb = new firebase();

exports.handler = async (change, context) => {
    const rest = context.params.rest,
        restID = context.params.restID,
        day = context.params.hour,
        ts = context.params.timestamp,
        batch = fb.db.batch();

        fb.db.doc(rest + '/' + restID + '/restGlobals/predictionParams').get().then(doc => {
            const utc = doc.data().utc,
                customersPred = doc.data().customersPredict;
            if (customersPred) {
                const currTime = (Date.now()),
                    today = new Date(currTime + Number(utc)),
                    yearRef = fb.db.collection(rest + '/' + restID + '/YearlyActivity'),
                    todayRef = yearRef.doc(day).collection('Days'),
                    week = new Date(today.getTime());
                if (today.getHours() < 5) {
                    week.setDate(week.getDate() + 6);
                } else {
                    week.setDate(week.getDate() + 7);
                }
                const weekString: string = `${week.getFullYear()}` + '-' + `${week.getMonth()}` + '-' + `${week.getDate()}`;

                if (week.getDay() === Number(day) && ts !== weekString) {

                    const hourRef = todayRef.doc(weekString),
                        hours = [];

                    for (let k = 0; k < 24; k++) {
                        hours[k] = [];
                    }

                    todayRef.orderBy('timestamp').get().then(docs => {
                        let docCounter = 1;
                        docs.forEach(docc => {
                            if (docc.id !== weekString) {
                                const data = docc.data();
                                for (let g = 0; g < 24; g++) {
                                    hours[g].push({
                                        y: data['hour' + g].customersReal,
                                        x: docCounter
                                    });
                                }
                                docCounter = docCounter + 1;
                            }
                        });
                        return docCounter;
                    }).then((docCounter) => {
                        console.log(hours);
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
                            if (ySquaredSum === 0 || xSquaredSum === 0) {
                                r = 0;
                            } else {
                                r = xMultYSum / (Math.sqrt((xSquaredSum * ySquaredSum)));
                            }
                            //sqrt(C / vars -1)
                            sX = Math.sqrt((xSquaredSum / (length - 1)));

                            //sqrt(D / vars -1)
                            sY = Math.sqrt((ySquaredSum / (length - 1)));

                            if (sX === 0) {
                                b = 0;
                            } else {
                                b = (r * sY) / sX;
                            }
                            a = yAvg - (b * xAvg);
                            y = a + (b * (docCounter));
                            if(y<0) {
                                y=0; 
                            }
                            yPreds.push(Math.round(y));
                        }
                        let yTotal = 0;
                        for (let x = 0; x < 24; x++) {
                            yTotal += yPreds[x];
                            batch.set(hourRef, {
                                ['hour' + x]: {
                                    customersPred: yPreds[x]
                                }
                            }, {
                                merge: true
                            });
                        }
                        batch.set(hourRef, {
                            totalCustomersPred: yTotal
                        }, {
                            merge: true
                        });
                    }).then(() => {
                        return batch.commit().then(() => {
                            console.log('updated pred')
                        });
                    }).catch(err => {
                        return console.log(err)
                    });
                } else {
                    console.log('day should not have changed')
                }
            } else {
                console.log('prediction set to false at ' + restID);

            }
        }).catch(err => {
            return console.log(err)
        });
}