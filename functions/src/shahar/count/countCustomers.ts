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
    const sqlQuery = `SELECT Status,TableSize,OrderSize,OrderID FROM predictions.table_orders WHERE TimeStamp BETWEEN '${today.getTime()}' AND '${tommrow.getTime()}' AND RestID = '${restID}' AND (Status = 'closed' OR Status = 'active') ORDER BY Status Asc;`,
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
        const sittingTables = {},
            paidTables = {},
            total = {};
        let totalOfTotal = 0,
            totalOfPaid = 0,
            totalOfSitting = 0;
        
        rows.forEach(element => {
            console.log(element);
            switch (element.Status) {
                case 'active':
                    sittingTables[element.OrderID] = element.TableSize;
                    total[element.OrderID] = element.TableSize;
                    break;
                case 'closed':
                    paidTables[element.OrderID] = element.OrderSize;
                    total[element.OrderID] = element.OrderSize;
                    if(sittingTables[element.OrderID]) {
                        sittingTables[element.OrderID] = 0;
                    }
                    break;
                default:
                    break;
            }
        });
        const totalKeys = Object.keys(total),
            sittingKeys = Object.keys(sittingTables),
            paidKeys = Object.keys(paidTables);
        for(let i=0; i<totalKeys.length; i++) {
            totalOfTotal += total[totalKeys[i]];
        }
        for(let i=0; i<sittingKeys.length; i++) {
            totalOfSitting += sittingTables[sittingKeys[i]];
        }
        for(let i=0; i<paidKeys.length; i++) {
            totalOfPaid += paidTables[paidKeys[i]];
        }
        batch.set(statisticalRef, {
            totalDailyCustomers: totalOfTotal,
            sittingTables: totalOfSitting,
            paidTables: totalOfPaid
        },{ merge: true });

        batch.commit().then(() => res.status(200).send(`complete adding all the data to ${restID}`)).catch(err => {
                console.log(err);
                res.status(404).send(err);
        });
    }).catch(err => {
        res.status(404).send(err);
        console.log(err)
    });
}