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
    if(data) {
        const customerID = data.orderedBy,
            instantOrder = data.instantOrder,
            timeStamp = parseInt((new Date(data.date).getTime()).toFixed(0)),
            size = data.friends.length,
            status = data.status,
            tableSize = data.tableObj.size,

            table = fb.bq.dataset('predictions').table('table_orders');
        if (status === 'closed' || !before) {
            const tableOrder = {
                RestID: restID,
                InstantOrder: instantOrder,
                TableSize: tableSize,
                OrderID: orderID,
                CustomerID: customerID,
                TimeStamp: timeStamp,
                OrderSize: size,
                Status: status,
                Time: dateFormat(new Date(), `yyyy-mm-dd'T'HH:MM:ss`),
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
}