import * as firebase from '../lib/firebase.js'

const fb = new firebase();

exports.handler = async (data, context) => {

    const restId = data.restId;
    const tableId = data.tableId;
    console.log('data', data);
    const batch = fb.db.batch();
    batch.update(fb.db.doc(`/${fb.rest}/${restId}/Tables/${tableId}`), data.newTable);

    return batch.commit();
}