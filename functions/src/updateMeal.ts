import * as firebase from '../lib/firebase.js'

const fb = new firebase();

exports.handler = async (data, context) => { 
    const restId = data.restId;
    const meal = data.meal;

    return fb.db.collection(`/RestAlfa/${restId}/Meals`).doc(meal.name).set(meal, { merge: true });
};