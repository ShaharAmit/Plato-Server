import * as firebase from '../lib/firebase.js'

const fb = new firebase();

exports.handler = async (data, context) => {
    const batch = fb.db.batch();

    return new Promise((resolve, reject) => {
        const tablesCollection = fb.db.collection(`/RestAlfa/${data.restId}/Tables`);
        data.tables.forEach(table => batch.update(tablesCollection.doc(table.id), {displayed: false}));
        batch.commit().then(resolve).catch(reject);
    });
};