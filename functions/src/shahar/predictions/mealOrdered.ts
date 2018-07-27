import * as firebase from '../../../lib/firebase.js'
const fb = new firebase(),
    dateFormat = require('dateformat');

exports.handler = async (change, context) => {
    const restID = context.params.restID,
        orderID = context.params.orderID,
        rest = context.params.rest,
        mealID = context.params.mealID,
        afterData = change.after.data(),
        beforeData = change.before.data();
    if (afterData) {
        if (!beforeData || beforeData.status !== afterData.status) {
            const meal = afterData.mealId,
                status = afterData.status,
                customer = afterData.customer,
                timestamp = (Date.now()),
                dishRef = fb.db.collection(rest + '/' + restID + '/Orders/' + orderID + '/meals/' + mealID + '/dishes'),
                table = fb.bq.dataset('predictions').table('meal_orders'),
                json = {},
                dishID = [];
            json[meal] = {};
            await dishRef.get().then(dishes => {
                const promises = [];
                dishes.forEach(dish => {
                    json[meal][dish.id] = {};
                    dishID.push(dish.id);
                    const p = dishRef.doc(`${dish.id}`).collection('groceries').get();
                    promises.push(p);
                });
                return Promise.all(promises);
            }).then((groceriesDocs) => {
                let i = 0;
                groceriesDocs.forEach(groceries => {
                    groceries.forEach(grocerie => {
                        json[meal][dishID[i]][grocerie.id] = {};
                        json[meal][dishID[i]][grocerie.id]['rawMaterial']={}
                        json[meal][dishID[i]][grocerie.id]['rawMaterial'] = grocerie.data().rawMaterial;
                    });
                    i++;
                });
                const row = {
                    RestID: restID,
                    Order: orderID,
                    MealCode: mealID,
                    MealID: meal,
                    Status: status,
                    TimeStamp: timestamp,
                    Customer: customer,
                    Time: dateFormat(new Date(), `yyyy-mm-dd'T'HH:MM:ss`),
                    MealJson: JSON.stringify(json)
                };
                console.log('row', row)
                return table.insert(row)
                    .then(() => {
                        console.log(`Inserted order with status: ${status}`);
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
        } else {
            console.log('nothign changed');
        }
    } else {
        console.log('order deleted')
    }
}