import * as firebase from '../../../lib/firebase.js'
const fb = new firebase();

exports.handler = async (req, res) => {
    const rest = fb.rest,
        utc = req.query.utc,
        restID = req.query.restID;

    const endTime = new Date();
    if (endTime.getHours() < 5) {
        endTime.setHours(5);
        endTime.setMinutes(0);
    } else {
        endTime.setDate(endTime.getDate() + 1);
        endTime.setHours(5);
        endTime.setMinutes(0);
    }

    //+day (in sec)
    const startTime = new Date(endTime.getTime());
    startTime.setDate(startTime.getDate() - 1);
    const todayDate = `${startTime.getFullYear()}` + '-' + `${startTime.getMonth()}` + '-' + `${startTime.getDate()}`;

    const hours = [];
    const yearRef = fb.db.collection(rest + '/' + restID + '/YearlyActivity'),
        todayRef = yearRef.doc((startTime.getDay()).toString()).collection('Days'),
        batch = fb.db.batch();
    let dayRef;

    dayRef = todayRef.doc(todayDate);
    for (let i = 0; i < 24; i++) {
        hours[i] = 0;
    }

    let job;
    const sqlQuery = `SELECT OrderSize, TimeStamp FROM predictions.table_orders WHERE TimeStamp BETWEEN '${startTime.getTime()}' AND '${endTime.getTime()}' AND RestID = '${restID}' AND Status = 'closed' ORDER BY TimeStamp Asc;`,
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
        for (let row of rows) {
            const hour = new Date();
            hour.setTime(row.TimeStamp);
            hours[hour.getHours()] = hours[hour.getHours()] + row.OrderSize;
        };
        let total = 0;
        for (let hour = 0; hour < 24; hour++) {
            total+=hours[hour];
            batch.set(dayRef, {
                ['hour' + hour]: {
                    customersReal: hours[hour]
                }
            }, {
                merge: true
            });
        }
        batch.set(dayRef, {
            timestamp: startTime.getTime(),
            totalCustomersReal: total
        }, {
            merge: true
        });        batch.commit().then(() => res.status(200).send(`complete adding all the data to ${restID}`)).catch(err => {
            console.log(err);
            res.status(404).send(err)
        });
    }).catch(err => {
        console.log(err);
        res.status(404).send(err);
    });

}