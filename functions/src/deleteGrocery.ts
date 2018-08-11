import * as firebase from '../lib/firebase.js'

const fb = new firebase();

exports.handler = async (data, context) => {
    console.log('restId: ', data.restId);
    const batch = fb.db.batch();
    batch.delete(fb.db.collection('RestAlfa' + '/' + data.restId + '/Grocery/').doc(data.grocery.name));
    return batch.commit();
};