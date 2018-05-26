import * as firebase from '../lib/firebase.js'
const fb = new firebase();

exports.handler = async (change, context) => {
    const restID = context.params.restID,
        orderID = context.params.order,
        rest = context.params.rest,
        mealID = context.params.mealID,
        dish = context.params.dish,
        data = change.data(),
        tableID = data.tableID,
        customerID = data.orderedBy,
        instantOrder = data.instantOrder,
        timeStamp = data.date,
        table = fb.bq.dataset('predictions').table('table_orders');

    fb.db.doc(rest+'/'+restID+'/Tables/'+tableID).get()
        .then(docData => {
            return docData.data().size;
        }).then(tableSize => {
            return {
                RestID: restID,
                InstantOrder: instantOrder,
                TableSize: tableSize,
                OrderID: orderID,
                CustomerID: customerID,
                TimeStamp: timeStamp
            };
        }).then(row => {
            table.insert(row)
                .then(() => {
                    console.log(`Inserted ${row.length} rows`);
                    return 0;
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

 