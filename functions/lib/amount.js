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
                const bAmn = before.value.amount;
                const aAmn = after.value.amount;
                const redLine = after.value.redLine;
                let messages = [];
                const messageDocs = yield fb.db.collection(rest + '/' + restID + '/Messages/alfa-1/Messages').get();
                messageDocs.forEach(doc => {
                    const messageDoc = doc.data();
                    const messageID = doc.id;
                    messages.push({ messageDoc: messageDoc, messageID: messageID });
                });
                fb.db.collection(rest + '/' + restID + '/WarehouseStock/' + rawMaterial + '/Meals').get().then(function (docs) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (bAmn < aAmn) {
                            const batch = fb.db.batch();
                            docs.forEach(doc => {
                                const docVals = doc.data();
                                const docID = doc.id;
                                if (!docVals.menu && parseFloat(docVals.redLine) < aAmn) {
                                    for (let f = 0; f < messages.length; f++) {
                                        if (messages[f]['messageDoc'].message.title === docID) {
                                            batch.delete(fb.db.collection(rest + '/' + restID + '/Messages/alfa-1/Messages').doc(messages[f]['messageID']));
                                        }
                                    }
                                    batch.update(fb.db.doc(rest + '/' + restID + '/Meals/' + docID), { displayed: true });
                                    batch.update(fb.db.doc(rest + '/' + restID + '/WarehouseStock/' + rawMaterial + '/Meals/' + docID), { menu: true });
                                }
                            });
                            return batch.commit().then(function () { console.log('meals back to menu'); }).catch(err => console.log(err));
                        }
                        else if (bAmn > aAmn && aAmn <= parseFloat(redLine)) {
                            const batch = fb.db.batch();
                            docs.forEach(doc => {
                                const docVals = doc.data();
                                const docID = doc.id;
                                if (parseFloat(docVals.redLine) >= aAmn && docVals.importance && docVals.menu) {
                                    const messageRef = fb.db.collection(rest + '/' + restID + '/Messages/alfa-1/Messages').doc();
                                    batch.set(messageRef, {
                                        message: {
                                            title: docID,
                                            body: docID + ' missing ' + rawMaterial,
                                            url: 'https://plato-manager-c3bbf.firebaseapp.com'
                                        }
                                    });
                                    batch.update(fb.db.doc(rest + '/' + restID + '/Meals/' + docID), { displayed: false });
                                    batch.update(fb.db.doc(rest + '/' + restID + '/WarehouseStock/' + rawMaterial + '/Meals/' + docID), { menu: false });
                                }
                            });
                            return batch.commit().then(function () { console.log('meals removed from menu'); }).catch(err => console.log(err));
                        }
                        else {
                            return 0;
                        }
                    });
                }).catch(err => { console.error(err); });
            }
        }
        catch (err) {
            console.error(err);
        }
    });
};
//# sourceMappingURL=amount.js.map