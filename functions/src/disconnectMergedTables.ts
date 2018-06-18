import * as firebase from '../lib/firebase.js'
import {Table} from "./validateTablesAreConnectable";

const fb = new firebase();

exports.handler = async (data, context) => {

    const batch = fb.db.batch();
    const restId = data.restId;
    const mergedTable = data.mergedTable;
    let connectedToId = '';
    Object.keys(mergedTable.connectedTo).forEach(x => {
        if (mergedTable.connectedTo[x]) {
            connectedToId = x.split('table')[1];
        }
    });

    batch.update(fb.db.doc(`/RestAlfa/${restId}/Tables/${connectedToId}`), {displayed: true});
    return new Promise((resolve, reject) => {
        fb.db.doc(`/RestAlfa/${restId}/Tables/${mergedTable.id}/OriginDataTable/data`).get()
            .then(x => {
                const originalData = x.data();
                batch.set(fb.db.doc(`/RestAlfa/${restId}/Tables/${mergedTable.id}`), originalData);
                batch.commit().then(resolve).catch(reject);
            })
    })
};