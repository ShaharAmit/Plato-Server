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
                const restID = context.params.restID;
                const rawMaterial = context.params.rawMaterial;
                const docs = yield fb.getCol('shahar/' + restID + '/WarehouseStock/' + rawMaterial + '/Meals');
                const bAmn = before.amount;
                const aAmn = after.amount;
                const redLine = after.redLine;
                if (bAmn < aAmn) {
                    docs.forEach(doc => {
                        const docVals = doc.data();
                        const docID = doc.id;
                        if (!docVals.menu && docVals.importance && docVals.redLine < redLine) {
                            // Update the population of 'SF'
                            // const ref = fb.db.doc("SF");
                            // batch.update(sfRef, {"population": 1000000});
                        }
                    });
                }
                else if (bAmn > aAmn) {
                    docs.forEach(doc => {
                        const docVals = doc.data();
                        const docID = doc.id;
                    });
                }
            }
        }
        catch (err) {
        }
        return 0;
    });
};
//# sourceMappingURL=amount.js.map