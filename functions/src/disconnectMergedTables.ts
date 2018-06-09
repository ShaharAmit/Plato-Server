import * as firebase from '../lib/firebase.js'

const fb = new firebase();

exports.handler = async (data, context) => {
    const batch = fb.db.batch();

    return new Promise((resolve, reject) => {
        const tablesCollection = fb.db.collection(`/RestAlfa/${data.restId}/Tables`);
        const tablesIds = data.mergedTable.id.split('+');
        tablesIds.forEach(tableId => batch.update(tablesCollection.doc(tableId), {displayed: true}));
        batch.delete(tablesCollection.doc(data.mergedTable.id));
        batch.delete(fb.db.doc(`/RestAlfa/${data.restId}/TablesOrders/${data.mergedTable.id}`));
        batch.commit().then(resolve).catch(reject);
    });
};