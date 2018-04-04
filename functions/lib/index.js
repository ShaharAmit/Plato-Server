"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testFunction = require('./test');
const docChangeExapmle = require('./docChangeExapmle');
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
//# sourceMappingURL=index.js.map