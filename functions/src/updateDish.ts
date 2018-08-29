import * as firebase from '../lib/firebase.js'

const fb = new firebase();

exports.handler = async (data, context) => {
    const restId = data.restId;
    const dish = data.dish;

    console.log('with merge true 3');
    return fb.db.collection(`/${fb.rest}/${restId}/Dishes`).doc(dish.name).set(dish, { merge: true });
}