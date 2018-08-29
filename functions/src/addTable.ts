import * as firebase from '../lib/firebase.js'

const fb = new firebase();

exports.handler = async (data, context) => {
    const batch = fb.db.batch();

    return new Promise((resolve, reject) => {
        batch.set(fb.db.collection(`/${fb.rest}/${data.restId}/Tables`).doc(data.table.id), data.table);
        batch.set(fb.db.collection(`/${fb.rest}/${data.restId}/TablesOrders`).doc(data.table.id), {});
        batch.set(fb.db.collection(`/${fb.rest}/${data.restId}/Tables/${data.table.id}/OriginDataTable`).doc("data"), data.table);
        batch.commit().then(resolve).catch(reject);
    });
};