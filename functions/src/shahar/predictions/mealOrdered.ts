import * as firebase from '../../../lib/firebase.js'
const fb = new firebase();

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
                timestamp = (Date.now()),
                table = fb.bq.dataset('predictions').table('meal_orders'),
                row = {
                    RestID: restID,
                    Order: orderID,
                    MealCode: mealID,
                    MealID: meal,
                    Status: status,
                    TimeStamp: timestamp
                };
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
        } else {
            console.log('nothign changed');
        }
    } else {
        console.log('order deleted')
    }
}