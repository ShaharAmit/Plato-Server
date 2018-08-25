import * as firebase from '../lib/firebase.js'

const fb = new firebase();

exports.handler = async (data, context) => {
    const restId = data.restId;
    const mealName = data.mealName;
    const dishName = data.dishName;

    const batch = fb.db.batch();
    batch.delete(fb.db.doc(`/RestAlfa/${restId}/Meals/${mealName}/dishes/${dishName}`));

    return batch.commit();
}