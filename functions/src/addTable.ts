import * as firebase from '../lib/firebase.js'

const fb = new firebase();

exports.handler = async (data, context) => {
    const batch = fb.db.batch();

    return new Promise((resolve, reject) => {
        batch.set(fb.db.collection(`/RestAlfa/${data.restId}/Tables`).doc(data.table.id), data.table);
        batch.set(fb.db.collection(`/RestAlfa/${data.restId}/TablesOrders`).doc(data.table.id), {});
        batch.commit().then(resolve).catch(reject);
    });
};