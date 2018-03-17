"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testFunction = require('./test');
const firebase = require("../lib/firebase.js");
var fb = new firebase();
exports.testFunction = fb.functions.https.onRequest((req, res) => {
    testFunction.handler(req, res);
});
//# sourceMappingURL=index.js.map