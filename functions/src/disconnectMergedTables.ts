import * as firebase from '../lib/firebase.js'
import {Table} from "./validateTablesAreConnectable";

const fb = new firebase();

exports.handler = async (data, context) => {

    const batch = fb.db.batch();
    const restId = data.restId;
    const movedTableId = data.movedTable;
    const mergedTable = data.mergedTable;
    let mergeTableToriginalTable: Object = {};
    const connectedToId = data.mergedTable.id;

    return new Promise((resolve, reject) => {
        console.log('datadis', data);
        console.log('connectedToId', connectedToId);
        console.log('mergedTableid', mergedTable.id);
        console.log('movedTableId', movedTableId);
        batch.update(fb.db.doc(`/RestAlfa/${restId}/Tables/${movedTableId}`), {displayed: true});
        batch.set(fb.db.doc(`/RestAlfa/${data.restId}/Tables/${movedTableId}`),{connectedTo: {['table'+ connectedToId]:false}}, {merge: true});
        batch.set(fb.db.doc(`/RestAlfa/${data.restId}/Tables/${connectedToId}`),{connectedTo: {['table'+ movedTableId]:false}}, {merge: true});
        mergeTableToriginalTable = getOriginalTable(restId, connectedToId);
        batch.set(fb.db.doc(`/RestAlfa/${restId}/Tables/${connectedToId}`),{mergeTableToriginalTable});

        console.log('mergeTableToriginalTable', mergeTableToriginalTable);

        // const tablesCollection = fb.db.collection(`/RestAlfa/${data.restId}/Tables`);
        // const tablesIds = data.mergedTable.id.split('+');
        // tablesIds.forEach(tableId => batch.update(tablesCollection.doc(tableId), {displayed: true}));
        // batch.delete(tablesCollection.doc(data.mergedTable.id));
        // batch.delete(fb.db.doc(`/RestAlfa/${data.restId}/TablesOrders/${data.mergedTable.id}`));
        batch.commit().then(resolve).catch(reject);
    });
};

export function getOriginalTable(restId: string, connectedToId: string): any {
    let originalTable: Object = {};
     fb.db.doc(`/RestAlfa/${restId}/Tables/${connectedToId}/OriginDataTable/data`).get()
        .then(doc => {
            originalTable = doc.data();
            console.log('originalTable', originalTable);
            return originalTable;
        });
}