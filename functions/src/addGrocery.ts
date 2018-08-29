import * as firebase from '../lib/firebase.js'

const fb = new firebase();

exports.handler = async (data, context) => {
    console.log('restId: ', data.restId);
    fb.db.collection(fb.rest + '/' + data.restId + '/Grocery/').doc(data.grocery.name)
        .set(data.grocery);
    console.log('add grocery is working');
};