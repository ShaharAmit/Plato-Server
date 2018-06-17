import * as firebase from '../lib/firebase.js'

const fb = new firebase();

exports.handler = async (data, context) => {
    const batch = fb.db.batch();

    return new Promise((resolve, reject) => {
        const table1 = data.tables[0];
        const table2 = data.tables[1];
        batch.set(fb.db.collection(`/RestAlfa/${data.restId}/Tables/${table1}/connectableTables`).doc(table2), {id: table2});
        batch.set(fb.db.collection(`/RestAlfa/${data.restId}/Tables/${table2}/connectableTables`).doc(table1), {id: table1});
        batch.set(fb.db.doc(`/RestAlfa/${data.restId}/Tables/${table1}`),{connectedTo: {['table'+ table2]:false}}, {merge: true});
        batch.set(fb.db.doc(`/RestAlfa/${data.restId}/Tables/${table2}`),{connectedTo: {['table'+ table1]:false}}, {merge: true});
        batch.commit().then(resolve).catch(reject);
    });
};