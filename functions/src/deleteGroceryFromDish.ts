import * as firebase from '../lib/firebase.js'

const fb = new firebase();

exports.handler = async (data, context) => {
    const restId = data.restId;
    const dishName = data.dishName;
    const groceryName = data.groceryName;

    return fb.db.doc(`/RestAlfa/${restId}/Dishes/${dishName}/grocery/${groceryName}`).delete();
}