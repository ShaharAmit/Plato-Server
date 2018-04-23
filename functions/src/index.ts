
const testFunction = require('./test');
const sendMessage = require('./sendMessage');
const amount = require('./amount');
const redLine = require('./redLine');
const registerToRest = require('./registerToRest');


import * as firebase from '../lib/firebase.js'

const fb = new firebase();

exports.registerToRest = fb.functions.https.onRequest((req, res) => {
    registerToRest.handler(req, res);
});

exports.sendMessage = fb.functions.firestore
    .document('{rest}/{restID}/Messages/{receiverID}/Messages/{messageID}')
    .onCreate((change,context) => {
        sendMessage.handler(change, context);
        return 0;
    });

exports.amount = fb.functions.firestore
.document('{rest}/{restID}/WarehouseStock/{rawMaterial}').onUpdate((change, context) => {
    amount.handler(change, context);
    return 0;
});

exports.redLine = fb.functions.firestore
.document('{rest}/{restID}/WarehouseStock/{rawMaterial}/Meals/{meal}').onCreate((change, context) => {
    redLine.handler(change, context);
    return 0;
});

