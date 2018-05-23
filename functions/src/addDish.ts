import * as firebase from '../lib/firebase.js'

const fb = new firebase();

exports.handler = async (data, context) => {
    console.log('restId: ', data.restId);
    fb.db.collection('RestAlfa' + '/' + data.restId + '/Dishes/').doc(data.dish.name)
        .set(data.dish);
    console.log('add dish is working');
    fb.db.collection('RestAlfa' + '/' + data.restId + '/Dishes/' + data.dish.name + data.grocery.name).doc(data.grocery.name)
        .set(data.grocery.name);
    console.log('add dish is working');
};