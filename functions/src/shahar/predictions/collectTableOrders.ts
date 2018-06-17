import * as firebase from '../../../lib/firebase.js'
const fb = new firebase();

exports.handler = async (req, res) => {
    const rest = fb.rest,
        utc = req.query.utc,
        restID = req.query.restID;

    const today = new Date();
        today.setTime(today.getTime() + Number(utc));

        const endTime = new Date();
        endTime.setTime(today.getTime());

        //+day (in sec)
        const startTime = new Date();
        startTime.setDate(endTime.getDate() -1);

        const hours = [];
        const yearRef = fb.db.collection(rest + '/' + restID + '/YearlyActivity'),
        todayRef =  yearRef.doc((startTime.getDay()).toString()).collection('Days'),
        batch = fb.db.batch();
        let dayRef;
    
    await todayRef.orderBy("timestamp",'desc').limit(1).get().then(docs => {
        docs.forEach(doc => {
            dayRef = todayRef.doc(doc.id);
        }); 
        for (let i = 0; i < 24; i++) {
            hours[i] = 0;
        }
    });
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
            for (let hour = 0; hour < 24; hour++) {
                batch.update(dayRef, {
                    ['hour'+hour]: {
                        customersReal: hours[hour]
                        }
                    },{ merge: true }
                );
            }
            batch.commit().then(() => res.status(200).send(`complete adding all the data to ${restID}`)).catch(err => {console.log(err); res.status(404)});
        }).catch(err => {console.log(err); res.status(404);});    
}