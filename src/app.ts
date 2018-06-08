var firebase1 = require('../services/firebase.js'),
request = require('request');
import {Promise} from 'es6-promise';


class App {
    fb: any;
    constructor() {
        this.fb = new firebase1();
        this.shaharTests();
        // this.danaIgraTests();
        // this.test123();
    }
    shaharTests() {
        const currTime = (Date.now()/1000) - 86400;
        const ref = this.fb.db.collection('RestAlfa');
        ref.orderBy('name','desc').limit(3).get().then(docs => {
            docs.forEach(doc => {
                const data = doc.data(),
                    utc = data.utc,
                    startTime = currTime-900000,
                    //+day (in sec)
                    endTime = currTime+86400,
                    restID = doc.id;
                let job;
                const sqlQuery = `SELECT * FROM predictions.table_orders WHERE TimeStamp BETWEEN '${startTime}' AND '${endTime}' AND RestID = '${restID}';`,
                    options = {
                        query: sqlQuery,
                        useLegacySql: false
                    };
                this.fb.bq.createQueryJob(options).then(results => {
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
        });
    }

    danielLuzTests () {
        const ref = this.fb.db.doc
    }

    loraineTests () {
        console.log('test')
    }

    danaIgraTests () {
        console.log("start dana func");
         let req :{
              query: {
                path: "/RestAlfa/kibutz-222/Orders/1524998020/meals/j55652Oakv7jc3f6Iogh/dishes/Burger"
            }
        }
        const dish = this.fb.db.doc(req.query.path);
        dish.update({
         status: 2,
        }).then(()=>{
            console.log("dish changed");
        }).catch(err=>{
            console.log("err");
        });

        
    }

    danielYosefTests () {
        
    }

    helloTest() {
        console.log('hey');
    }

    test123() {
        console.log('12');
    }
}
module.exports = App;
new App();
