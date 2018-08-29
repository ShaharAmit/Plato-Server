import * as firebase from '../lib/firebase.js'

const fb = new firebase();

exports.handler = async (data, context) => {
    console.log('restId: ', data.restId);
    const batch = fb.db.batch();
    batch.update(fb.db.collection(fb.rest + '/' + data.restId + '/Grocery/').doc(data.grocery.name), data.grocery);
    return batch.commit();
};