import * as firebase from '../lib/firebase.js'
const fb = new firebase();
//    .document('{rest}/{restID}/Orders/{orderID}/meals/{mealID}').onWrite((change, context) => {

exports.handler = async (change, context) => {
    const restID = context.params.restID,
        orderID = context.params.order,
        rest = context.params.rest,
        mealID = context.params.mealID,
        data = change.after.data(),
        meal = data.mealID,
        status = data.status,
        timeStamp = fb.fieldValue.serverTimestamp();
        console.log(timeStamp);

    // fb.db.doc(rest+'/'+restID+'/Tables/'+tableID).get()
    //     .then(docData => {
    //         return docData.data().size;
    //     }).then(tableSize => {
    //         return {
    //             RestID: restID,
    //             InstantOrder: instantOrder,
    //             TableSize: tableSize,
    //             OrderID: orderID,
    //             CustomerID: customerID,
    //             TimeStamp: timeStamp
    //         };
    //     }).then(row => {
    //         table.insert(row)
    //             .then(() => {
    //                 console.log(`Inserted ${row.length} rows`);
    //                 return 0;
    //             })
    //             .catch(err => {
    //                 if (err && err.name === 'PartialFailureError') {
    //                     if (err.errors && err.errors.length > 0) {
    //                         console.log('Insert errors:');
    //                         err.errors.forEach(error => console.error(error));
    //                     }
    //                 } else {
    //                     console.error('ERROR:', err);
    //                 }
    //             });
    //     });
 }

 