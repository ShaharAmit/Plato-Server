import * as firebase from '../lib/firebase.js'

const fb = new firebase();

exports.handler = async (data, context) => {
    const batch = fb.db.batch();

    batch.update(fb.db.doc(`/RestAlfa/${data.restId}/Tables/${data.tableId}`), {x: data.newX, y: data.newY});

    return batch.commit();
};