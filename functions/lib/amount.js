"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase = require("../lib/firebase.js");
const fb = new firebase();
exports.handler = function (change, context) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const before = change.before.data();
            const after = change.after.data();
            if (before && after) {
                const rest = context.params.rest;
                const restID = context.params.restID;
                const rawMaterial = context.params.rawMaterial;
                const docs = yield fb.getCol(rest + '/' + restID + '/WarehouseStock/' + rawMaterial + '/Meals');
                const bAmn = before.value.amount;
                const aAmn = after.value.amount;
                const redLine = after.value.redLine;
                if (bAmn < aAmn) {
                    docs.forEach(doc => {
                        const docVals = doc.data();
                        const docID = doc.id;
                        if (!docVals.menu && parseFloat(docVals.redLine) < aAmn) {
                            const batch = fb.db.batch();
                            batch.update(fb.db.doc(rest + '/' + restID + '/Meals/' + docID), { displayed: true });
                            batch.update(fb.db.doc(rest + '/' + restID + '/WarehouseStock/' + rawMaterial + '/Meals/' + docID), { menu: true });
                            batch.commit().then(function () { console.log(docID + '  back displayed'); });
                        }
                    });
                }
                else if (bAmn > aAmn && aAmn < parseFloat(redLine)) {
                    docs.forEach(doc => {
                        const docVals = doc.data();
                        const docID = doc.id;
                        if (parseFloat(docVals.redLine) > aAmn && docVals.importance && docVals.menu) {
                            const batch = fb.db.batch();
                            batch.update(fb.db.doc(rest + '/' + restID + '/Meals/' + docID), { displayed: false });
                            batch.update(fb.db.doc(rest + '/' + restID + '/WarehouseStock/' + rawMaterial + '/Meals/' + docID), { menu: false });
                            batch.commit().then(function () { console.log(docID + ' is no longer displayed'); });
                        }
                    });
                }
            }
        }
        catch (err) {
            console.error(err);
        }
        return 0;
    });
};
//# sourceMappingURL=amount.js.map