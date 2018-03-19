
const testFunction = require('./test');
const docChangeExapmle = require('./docChangeExapmle');


import * as firebase from '../lib/firebase.js'

const fb = new firebase();

exports.testFunction = fb.functions.https.onRequest((req, res) => {
    testFunction.handler(req, res);
});

exports.docChangeExapmle = fb.functions.firestore
.document('Customers/304861412').onWrite((event) => {
    docChangeExapmle.handler(event);
    return 0;
});

