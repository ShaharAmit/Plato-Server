import * as firebase from '../lib/firebase.js'

const fb = new firebase();

exports.handler = async (data, context) => {
    console.log('restId: ', data.restId);
    fb.db.collection('RestAlfa' + '/' + data.restId + '/Grocery/').doc(data.grocery.name).delete();
    console.log('grocery deleted')
};