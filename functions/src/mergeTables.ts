import * as firebase from '../lib/firebase.js'

const fb = new firebase();

class Table {
    acceabilty = false;
    isConnectable = false;
    displayed = true;
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    size: number;
    smoking = false;
    status = 'free';
    pLeft: number;
    pTop: number;
    pRight: number;
    pBottom: number;
}


exports.handler = async (data, context) => {

    const restId = data.restId;
    const movedTable = data.movedTable;
    const connectedToTable = data.connectedToTable;

    const mergedRect = getMergedRectangle(connectedToTable, movedTable);
    const mergedTable: any = {};
    mergedTable.id = connectedToTable.id;
    mergedTable.x = mergedRect.x;
    mergedTable.y = mergedRect.y;
    mergedTable.width = mergedRect.width;
    mergedTable.height = mergedRect.height;
    mergedTable.size = mergedTable.width * mergedTable.height * 2;
    mergedTable.smoking = movedTable.smoking && connectedToTable.smoking;
    mergedTable.acceabilty = movedTable.acceabilty;
    mergedTable.isConnectable = false;
    mergedTable.pTop = mergedTable.y;
    mergedTable.pLeft = mergedTable.x;
    mergedTable.pRight = mergedTable.x + mergedTable.width;
    mergedTable.pBottom = mergedTable.y + mergedTable.height;
    mergedTable.displayed = true;
    mergedTable.connectedTo = {};
    mergedTable.connectedTo['table' + movedTable.id] = true;
    mergedTable.connectedNow = true;
    const batch = fb.db.batch();

    batch.update(fb.db.doc(`/RestAlfa/${restId}/Tables/${movedTable.id}`), {displayed: false});
    batch.set(fb.db.doc(`/RestAlfa/${restId}/Tables/${connectedToTable.id}`), mergedTable, {merge: true});

    return new Promise((resolve, reject) => {
        batch.commit()
            .then(() => resolve(mergedTable))
            .catch(reject);
    });
};

export function getMergedRectangle(connectedToTable, movedTable): any {
    if (connectedToTable.width === movedTable.width) {
        const x = connectedToTable.x;
        const y = connectedToTable.y;
        const width = connectedToTable.width;
        const height = connectedToTable.height + movedTable.height;
        return {x, y, width, height};
    } else if (connectedToTable.height === movedTable.height) {
        const x = connectedToTable.x;
        const y = connectedToTable.y;
        const height = connectedToTable.height;
        const width = connectedToTable.width + movedTable.width;
        return {x, y, width, height};
    }

    return null;
}