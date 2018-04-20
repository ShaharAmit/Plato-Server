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
            const rest = context.params.rest;
            const restID = context.params.restID;
            const rawMaterial = context.params.rawMaterial;
            const meal = context.params.meal;
            const docs = yield fb.getCol(rest + '/' + restID + '/WarehouseStock/' + rawMaterial + '/Meals');
            let max = 0;
            docs.forEach(doc => {
                const docVals = doc.data();
                if (max < docVals.redLine) {
                    max = docVals.redLine;
                }
            });
            let data;
            const ref = fb.db.doc(rest + '/' + restID + '/WarehouseStock/' + rawMaterial);
            yield ref.get().then(function (doc) {
                if (doc) {
                    data = doc.data().value;
                }
            });
            ref.update({
                value: {
                    amount: data.amount,
                    redLine: max,
                    type: data.type,
                    unit: data.unit,
                    name: data.name
                }
            }).then(func => {
                console.log('updated redLine');
                return 0;
            }).catch(err => {
                console.log(err);
            });
        }
        catch (err) {
            console.log(err);
        }
    });
};
//# sourceMappingURL=redLine.js.map