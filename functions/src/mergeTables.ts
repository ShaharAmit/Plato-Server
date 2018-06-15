const addTable = require('./addTable');
const unDisplayTables = require('./unDisplayTables');
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
    const table1 = data.table1;
    const table2 = data.table2;

    const mergedRect = getMergedRectangle(table1, table2);
    const mergedTable: any = {};
    mergedTable.id = `${table1.id}+${table2.id}`;
    mergedTable.x = mergedRect.x;
    mergedTable.y = mergedRect.y;
    mergedTable.width = mergedRect.width;
    mergedTable.height = mergedRect.height;
    mergedTable.size = mergedTable.width * mergedTable.height * 2;
    mergedTable.smoking = table1.smoking && table2.smoking;
    mergedTable.acceabilty = table1.acceabilty;
    mergedTable.isConnectable = false;
    mergedTable.pTop = mergedTable.y;
    mergedTable.pLeft = mergedTable.x;
    mergedTable.pRight = mergedTable.x + mergedTable.width;
    mergedTable.pBottom = mergedTable.y + mergedTable.height;
    mergedTable.displayed = true;

    return new Promise((resolve, reject) => {
        const table = mergedTable;
        addTable.handler({restId, table}, context)
            .then(() => {
                unDisplayTables.handler({restId, tables: [table1, table2]}, context)
                    .then(x => {
                        resolve(mergedTable);
                    })
                    .catch(reject);
            })
            .catch(reject);
    });
};

export function getMergedRectangle(table1, table2): any {
    const id = `${table1.id}+${table2.id}`;
    if (table1.width === table2.width) {
        const x = table1.x;
        const y = table1.y;
        const width = table1.width;
        const height = table1.height + table2.height;
        return {x, y, width, height, id};
    } else if (table1.height === table2.height) {
        const x = table1.x;
        const y = table1.y;
        const height = table1.height;
        const width = table1.width + table2.width;
        return {x, y, width, height, id};
    }

    return null;
}