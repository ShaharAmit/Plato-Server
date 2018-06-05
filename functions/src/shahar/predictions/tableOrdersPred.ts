import * as firebase from '../../../lib/firebase.js'
const fb = new firebase();

exports.handler = async (req, res) => {
    const rest = fb.rest,
        docs = req.query.docs,
        currTime = (Date.now()/1000);
    docs.forEach(doc => {
        const data = doc.data(),
            utc = data.utc,
            startTime = currTime+utc,
            //+day (in sec)
            endTime = startTime+86400,
            restID = doc.id;
        let job;
        const sqlQuery = `SELECT * FROM predictions.table_orders WHERE TimeStamp BETWEEN '${startTime}' AND '${endTime}' AND RestID = '${restID}';`,
            options = {
                query: sqlQuery,
                useLegacySql: false
            };
        fb.bq.createQueryJob(options).then(results => {
            job = results[0];
            console.log(`Job ${job.id} started.`);
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
            console.log(`Job ${job.id} completed.`);
            return job.getQueryResults();
        }).then(results => {
            const rows = results[0];
            console.log('Rows:');
            rows.forEach(row => console.log(row));
        }).catch(err => {
            console.error('ERROR:', err);
        });
    });        
 }  