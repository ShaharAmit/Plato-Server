import * as firebase from '../lib/firebase.js'
import {getMergedRectangle} from "./mergeTables";
import {HttpsError} from "firebase-functions/lib/providers/https";

const fb = new firebase();

const width = 12;
const height = 12;

exports.handler = async (data: ({ movedTable: Table, connectedToTable: Table, restId: string }), context) => {

    console.log('data', data);
    const connectedToTable: Table = data.movedTable;
    const movedTable: Table = data.connectedToTable;
    console.log('connectedTo', connectedToTable);
    console.log('moved', movedTable);

    return new Promise((resolve, reject) => {

        // check if widths of two tables are equals
        if (connectedToTable.width === movedTable.width) {
            // Checks if the heights of the two tables are heigher than the height of the grid
            if (connectedToTable.y + connectedToTable.height + movedTable.height > height) {
                throw new HttpsError("aborted", 'Can\'t connect tables, height will overflow');
            }
        }
        // check if heights of two tables are equals
        else if (connectedToTable.height === movedTable.height) {
            // Checks if the widths of the two tables are higher than the height of the grid
            if (connectedToTable.x + connectedToTable.width + movedTable.width > width) {
                throw new HttpsError("aborted", 'Can\'t connect tables, width will overflow');
            }
        }
        else {
            // heights or width of two tables not equal, therefor it's possible to connect them
            throw new HttpsError("aborted", "Can only connect tables with same width or height");
        }

        // check if table display == true
        fb.db.collection<Table>(`/${fb.rest}/${data.restId}/Tables`, ref => ref.where('displayed', '==', 'true')).get()
            .then(tablesQuerySnapshot => {
                const tables = [];
                tablesQuerySnapshot.forEach(x => tables.push(x.data()));
                console.log('tables', tables);
                const grid = createEmptyGridObject();
                markRectangles(grid, tables);
                markRectangles(grid, [connectedToTable, movedTable], false);
                // check if tables are ovveride, if not, merge tables and show in grid 
                if (willRectangleWontOverrideOtherRectangles(grid, getMergedRectangle(connectedToTable, movedTable))) {
                    throw new HttpsError("aborted", 'Merged Table Will Override Existing tables');
                }

                resolve();

            }).catch(reject);
    });
};

// create a new empty grid
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

// write all tables in grid
function markRectangles(grid, rectangles, selectionState = true) {
    rectangles.forEach(rect => {
        for (let row = rect.y; row < rect.y + rect.height; row++) {
            for (let col = rect.x; col < rect.x + rect.width; col++) {
                grid[row][col].isSelected = selectionState;
            }
        }
    });
}

// check if table isn't override another table
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

// class of table
export class Table {
    displayed = true;
    x: number;
    y: number;
    width: number;
    height: number;
}

// class of grid cell in map of tables
class GridCell {
    isSelected: boolean = false;
}