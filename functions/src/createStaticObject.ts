import * as firebase from '../lib/firebase.js'

const fb = new firebase();

exports.handler = async (data, context) => {
    const batch = fb.db.batch();

    batch.set(fb.db.collection(`/RestAlfa/${data.restId}/StaticObjects`).doc(), data.staticObject);

    return batch.commit();
};