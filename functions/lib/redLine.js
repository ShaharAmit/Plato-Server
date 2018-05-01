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
exports.handler = (change, context) => __awaiter(this, void 0, void 0, function* () {
    try {
        const rest = context.params.rest;
        const restID = context.params.restID;
        const rawMaterial = context.params.rawMaterial;
        fb.db.collection(rest + '/' + restID + '/WarehouseStock/' + rawMaterial + '/Meals')
            .get()
            .then(docs => {
            let max = 0;
            docs.forEach(doc => {
                const docVals = doc.data();
                if (max < docVals.redLine) {
                    max = docVals.redLine;
                }
            });
            const ref = fb.db.doc(rest + '/' + restID + '/WarehouseStock/' + rawMaterial);
            ref.get()
                .then((doc) => {
                if (doc) {
                    return doc.data().value;
                }
            }).then(data => {
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
                });
            });
        }).catch(err => {
            console.error(err);
        });
    }
    catch (err) {
        console.error(err);
    }
});
//# sourceMappingURL=redLine.js.map