"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testFunction = require('./test');
const docChangeExapmle = require('./docChangeExapmle');
const amount = require('./amount');
const redLine = require('./redLine');
const firebase = require("../lib/firebase.js");
const fb = new firebase();
exports.testFunction = fb.functions.https.onRequest((req, res) => {
    testFunction.handler(req, res);
});
exports.docChangeExapmle = fb.functions.firestore
    .document('Customers/304861412').onWrite((data, context) => {
    docChangeExapmle.handler(data, context);
    return 0;
});
exports.amount = fb.functions.firestore
    .document('{rest}/{restID}/WarehouseStock/{rawMaterial}').onUpdate((change, context) => {
    amount.handler(change, context);
    return 0;
});
exports.redLine = fb.functions.firestore
    .document('{rest}/{restID}/WarehouseStock/{rawMaterial}/Meals/{meal}').onWrite((change, context) => {
    redLine.handler(change, context);
    return 0;
});
//# sourceMappingURL=index.js.map