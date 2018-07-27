import * as firebase from '../../../lib/firebase.js'
const fb = new firebase(),
    dateFormat = require('dateformat');
    
exports.handler = async (change, context) => {
    const restID = context.params.restID,
        orderID = context.params.order,
        rest = context.params.rest,
        tableID = context.params.tableID,

        before = change.before.data(),
        data = change.after.data();
    fb.db.doc(rest + '/' + restID + '/restGlobals/predictionParams').get().then(doc => {
        return doc.data().utc;
    }).then(utc => {
            if(data) {
                const customerID = data.orderedBy,
                    instantOrder = data.instantOrder,
                    size = data.friends.length,
                    status = data.status,
                    tableSize = data.tableObj.size,
        
                    table = fb.bq.dataset('predictions').table('table_orders');
                    let timeStamp = parseInt((new Date(data.date).getTime()).toFixed(0));
        
                if (status === 'closed' || !before || status === 'active') {
                    if(status === 'closed' || status === 'active') {
                        const time = new Date();
                        time.setTime(time.getTime() + Number(utc));
                        timeStamp = parseInt(time.getTime().toFixed(0));
                    }
                    const tableOrder = {
                        RestID: restID,
                        InstantOrder: instantOrder,
                        TableSize: tableSize,
                        OrderID: orderID,
                        CustomerID: customerID,
                        TimeStamp: timeStamp,
                        OrderSize: size,
                        Status: status,
                        Time: dateFormat(new Date(timeStamp), `yyyy-mm-dd'T'HH:MM:ss`),
                    };
                    return table.insert(tableOrder)
                        .then(() => {
                            console.log(`Inserted rows`);
                        })
                        .catch(err => {
                            if (err && err.name === 'PartialFailureError') {
                                if (err.errors && err.errors.length > 0) {
                                    console.log('Insert errors:');
                                    err.errors.forEach(error => console.error(error));
                                }
                            } else {
                                console.error('ERROR:', err);
                            }
                        });
                    // });
                } else {
                    console.log('table order edited');
                }
            } else {
                console.log('order deleted');
            }
        });
}