import * as firebase from '../../../lib/firebase.js'
const fb = new firebase();

exports.handler = async (req, res) => {
    const rest = fb.rest,
        utc = req.query.utc,
        restID = req.query.restID,
        batch = fb.db.batch(),
        today = new Date(),
        utcTime = new Date(),
        statisticalRef = fb.db.doc(rest + '/' + restID + '/restGlobals/restStatistical');

    utcTime.setTime(utcTime.getTime() + Number(utc));
    today.setHours(6 - (utcTime.getHours() - today.getHours()));
    const tommrow = new Date();
    tommrow.setTime(today.getTime());
    tommrow.setDate(tommrow.getDate() + 1);

    let job;
    const sqlQuery = `SELECT Status,MealCode FROM predictions.meal_orders WHERE TimeStamp BETWEEN '${today.getTime()}' AND '${tommrow.getTime()}' AND RestID = '${restID}' AND (Status = 0 OR Status = 1 OR Status = 2 OR Status = 3) ORDER BY Status Asc;`,
        options = {
            query: sqlQuery,
            useLegacySql: false
        };
    fb.bq.createQueryJob(options).then(results => {
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
        let total = {},
            waitingToBeMade = {},
            inMade = {},
            ready = {},
            destroyed = {};
        rows.forEach(element => {
            switch (element.Status) {
                case 0:
                    waitingToBeMade[element.MealCode] = 1;
                    total[element.MealCode] = 1;
                    break;
                case 1:
                    inMade[element.MealCode] = 1;
                    total[element.MealCode] = 1;
                    if (waitingToBeMade[element.MealCode]) {
                        waitingToBeMade[element.MealCode] = 0;
                    }
                    break;
                case 2:
                    ready[element.MealCode] = 1;
                    total[element.MealCode] = 1;
                    if (waitingToBeMade[element.MealCode]) {
                        waitingToBeMade[element.MealCode] = 0;
                    }
                    if (inMade[element.MealCode]) {
                        inMade[element.MealCode] = 0;
                    }
                    break;
                case 3:
                    destroyed[element.MealCode] = 1;
                    total[element.MealCode] = 1;
                    if (waitingToBeMade[element.MealCode]) {
                        waitingToBeMade[element.MealCode] = 0;
                    }
                    if (inMade[element.MealCode]) {
                        inMade[element.MealCode] = 0;
                    }
                    if (ready[element.MealCode]) {
                        ready[element.MealCode] = 0;
                    }
                    break;
                default:
                    break;
            }
        });
        const totalKeys = Object.keys(total),
            waitingToBeMadeKeys = Object.keys(waitingToBeMade),
            inMadeKeys = Object.keys(inMade),
            readyKeys = Object.keys(ready),
            destroyedKeys = Object.keys(destroyed);
        let totalOfTotal = 0,
            totalOfwaitingToBeMade = 0,
            totalOfinMade = 0,
            totalOfready = 0,
            totalOfdestroyed = 0;
        for (let i = 0; i < totalKeys.length; i++) {
            totalOfTotal += total[totalKeys[i]];
        }
        for (let i = 0; i < waitingToBeMadeKeys.length; i++) {
            totalOfwaitingToBeMade += waitingToBeMade[waitingToBeMadeKeys[i]];
        }
        for (let i = 0; i < inMadeKeys.length; i++) {
            totalOfinMade += inMade[inMadeKeys[i]];
        }
        for (let i = 0; i < readyKeys.length; i++) {
            totalOfready += ready[readyKeys[i]];
        }
        for (let i = 0; i < destroyedKeys.length; i++) {
            totalOfdestroyed += inMade[destroyedKeys[i]];
        }
        batch.set(statisticalRef, {
            todayOrderes: totalOfTotal,
            waitingToBeMade: totalOfwaitingToBeMade,
            inMade: totalOfinMade,
            ready: totalOfready,
            destroyed: totalOfdestroyed
        }, {
            merge: true
        });

        batch.commit().then(() => res.status(200).send(`complete adding all the data to ${restID}`)).catch(err => {
            console.log(err);
            res.status(404)
        });
    }).catch(err => {
        res.status(404);
        console.log(err)
    });
}