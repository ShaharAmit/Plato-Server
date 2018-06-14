var firebase1 = require('../services/firebase.js'),
    request = require('request');
import {
    Promise
} from 'es6-promise';

class App {
    fb: any;
    constructor() {
        this.fb = new firebase1();
        this.loraineTests();

        // this.shaharTests();


        // this.danaIgraTests();
        // this.test123();
        // this.danielYosefTests();
    }
    shaharTests() {
        const batch = this.fb.db.batch();
        const day = this.fb.db.collection('/RestAlfa/kibutz-222/YearlyActivity'),
        timestamp = 1528787520000;
        const test = this.fb.db.doc('/RestAlfa/kibutz-222/YearlyActivity/'+`2`+'/Days/'+timestamp.toString());
            batch.set(test,{
                month: 5,
                year: 2018,
                timestamp: timestamp
            });
                for(let j=0; j<24; j++) {
                    batch.update(test,{
                        ['hour'+j]: {
                            customersReal: 16,
                            customersPred: 16,
                        }
                    });  
                }
        
        batch.commit().then(()=>console.log('success'));

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
            friends = ['a','b'];
            date.setHours(date.getHours() - 1);

        this.fb.db.collection('/RestAlfa/kibutz-222/TablesOrders/5/orders').doc().set({
            date: date,
            orderedBy: orderedBy,
            status: status,
            instantOrder: instantOrder,
            id: id,
            friends: friends,
            size: 3,
            tableObj:  tableObj

        }).then(console.log('success'));

    }

    loraineTests() {
        let job;
        const sqlQuery = `SELECT * FROM predictions.table_orders WHERE RestID = 'mozes-333' AND Status = 'closed' ORDER BY TimeStamp Asc;`,
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
                console.log(rows);
        })
    }

    danaIgraTests() {

    }

    danielYosefTests() {

    }

}
module.exports = App;
new App();