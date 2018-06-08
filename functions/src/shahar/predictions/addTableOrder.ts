import * as firebase from '../../../lib/firebase.js'
const fb = new firebase();

exports.handler = async (change, context) => {
    const restID = context.params.restID,
        orderID = context.params.order,
        rest = context.params.rest,
        tableID = context.params.tableID,

        data = change.after.data(),
        customerID = data.orderedBy,
        instantOrder = data.instantOrder,
        timeStamp = parseInt((new Date(data.date).getTime() / 1000).toFixed(0)),
        size = data.size,
        status = data.status,

        table = fb.bq.dataset('predictions').table('table_orders');
        
if(status === 'closed') {
    return fb.db.doc(rest+'/'+restID+'/Tables/'+tableID).get()
        .then(docData => {
            return docData.data().size;
        }).then(tableSize => {
            return {
                RestID: restID,
                InstantOrder: instantOrder,
                TableSize: tableSize,
                OrderID: orderID,
                CustomerID: customerID,
                TimeStamp: timeStamp,
                OrderSize: size,
            };
        }).then(row => {
            return table.insert(row)
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
        });
    }
 }

 