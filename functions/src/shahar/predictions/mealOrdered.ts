import * as firebase from '../../../lib/firebase.js'
const fb = new firebase();

exports.handler = async (change, context) => {
    const restID = context.params.restID,
        orderID = context.params.orderID,
        rest = context.params.rest,
        mealID = context.params.mealID,
        data = change.after.data(),
        meal = data.mealId,
        status = data.status,
        timeStamp = (Date.now()/1000),
        table = fb.bq.dataset('predictions').table('meal_orders'),
        row = {
            RestID: restID,
            Order: orderID,
            MealID: mealID,
            MealName: meal,
            Status: status,
            TimeStamp: timeStamp
        };
        console.log(timeStamp);
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
 }

 