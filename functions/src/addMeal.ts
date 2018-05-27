import * as firebase from '../lib/firebase.js'

const fb = new firebase();

exports.handler = async (data, context) => {
    console.log('restId: ', data.restId);
    fb.db.collection('RestAlfa' + '/' + data.restId + '/Meals/').doc(data.meal.name)
        .set(data.meal);
    console.log('add meal is working');
    fb.db.collection('RestAlfa' + '/' + data.restId + '/Meals/' + 'dishes').doc(data.dish.name)
        .set(data.dish.name);
    console.log('add dishes is working');
};