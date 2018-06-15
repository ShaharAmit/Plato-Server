import * as firebase from '../lib/firebase.js'
import {getMergedRectangle} from "./mergeTables";
import {HttpsError} from "firebase-functions/lib/providers/https";

const fb = new firebase();

const width = 12;
const height = 12;

exports.handler = async (data: ({ table1: Table, table2: Table, restId: string }), context) => {

    console.log('data', data);
    const table1: Table = data.table1;
    const table2: Table = data.table2;

    return new Promise((resolve, reject) => {


        if (table1.width === table2.width) {
            if (table1.y + table1.height + table2.height > height) {
                throw new HttpsError("aborted", 'Can\'t connect tables, height will overflow');
            }
        } else if (table1.height === table2.height) {
            if (table1.x + table1.width + table2.width > width) {
                throw new HttpsError("aborted", 'Can\'t connect tables, width will overflow');
            }
        }
        else {
            throw new HttpsError("aborted", "Can only connect tables with same width or height");
        }

        fb.db.collection<Table>(`/RestAlfa/${data.restId}/Tables`, ref => ref.where('displayed', '==', 'true')).get()
            .then(tablesQuerySnapshot => {
                const tables = [];
                tablesQuerySnapshot.forEach(x => tables.push(x.data()));
                console.log('tables', tables);
                const grid = createEmptyGridObject();
                markRectangles(grid, tables);
                markRectangles(grid, [table1, table2], false);
                if (willRectangleWontOverrideOtherRectangles(grid, getMergedRectangle(table1, table2))) {
                    throw new HttpsError("aborted", 'Merged Table Will Override Existing tables');
                }

                resolve();

            }).catch(reject);
    });
};

function createEmptyGridObject() {
    const grid = {};
    for (let row = 0; row < height; row++) {
        grid[row] = {};

        for (let col = 0; col < width; col++) {
            grid[row][col] = new GridCell();
        }
    }

    return grid;
}

function markRectangles(grid, rectangles, selectionState = true) {
    rectangles.forEach(rect => {
        for (let row = rect.y; row < rect.y + rect.height; row++) {
            for (let col = rect.x; col < rect.x + rect.width; col++) {
                grid[row][col].isSelected = selectionState;
            }
        }
    });
}

function willRectangleWontOverrideOtherRectangles(grid, table: Table): boolean {
    console.log('grid', grid);
    console.log('merged', table);
    for (let row = table.y; row < table.y + table.height; row++) {
        for (let col = table.x; col < table.x + table.width; col++) {
            if (grid[row][col].isSelected) {
                return true;
            }
        }
    }

    return false;
}

export class Table {
    displayed = true;
    x: number;
    y: number;
    width: number;
    height: number;
}

class GridCell {
    isSelected: boolean = false;
}