const sendMessage = require('./sendMessage'),
    amount = require('./amount'),
    redLine = require('./redLine'),
    registerToRest = require('./registerToRest'),
    unRegisterToRest = require('./unRegisterToRest'),
    missingChanged = require('./missingChanged'),
    deleteGlobWorkers = require('./deleteGlobWorker'),
    createWorker = require('./createWorker'),
    createGlobWorker = require('./createGlobWorker'),
    addTableOrder = require('./addTableOrder'),
    addGrocery = require('./addGrocery'),
    testing = require('./testing');

import * as firebase from '../lib/firebase.js'

const fb = new firebase();

exports.registerToRest = fb.functions.firestore
    .document('{rest}/{restID}/Workers/{uid}')
    .onCreate((change,context)=> {
        const val = registerToRest.handler(change,context);
        return val;
    });

exports.unRegisterToRest = fb.functions.firestore
    .document('{rest}/{restID}/Workers/{uid}')
    .onDelete((change,context)=> {
        const val = unRegisterToRest.handler(change,context);
        return val;
    });

exports.missingChanged = fb.functions.firestore
    .document('{rest}/{restID}/Meals/{mealName}')
    .onUpdate((change,context)=> {
        const val = missingChanged.handler(change,context);
        return val;
    });

exports.sendMessage = fb.functions.firestore
    .document('{rest}/{restID}/Messages/{messageID}')
    .onCreate((change,context) => {
        const val = sendMessage.handler(change, context);
        return val;
    });

exports.amount = fb.functions.firestore
    .document('{rest}/{restID}/WarehouseStock/{rawMaterial}').onUpdate((change, context) => {
        const val = amount.handler(change, context);
        return val;
    });

exports.redLine = fb.functions.firestore
    .document('{rest}/{restID}/WarehouseStock/{rawMaterial}/Meals/{meal}').onCreate((change, context) => {
        const val = redLine.handler(change, context);
        return val;
    });

exports.deleteGlobWorkers = fb.functions.firestore
    .document('{rest}/{restID}/Workers/{uid}')
    .onDelete((change,context)=> {
        const val = deleteGlobWorkers.handler(change,context);
        return val;
    });

exports.createWorker = fb.functions.https.onCall((data, context) => {
    const val = createWorker.handler(data, context);
    return val;
});

exports.createGlobWorker = fb.functions.firestore
    .document('{rest}/{restID}/Workers/{uid}')
    .onCreate((change,context)=> {
        const val = createGlobWorker.handler(change,context);
        return val;
    });

exports.addTableOrder = fb.functions.firestore
    .document('{rest}/{restID}/TablesOrders/{tableID}/orders/{order}').onCreate((change, context) => {
        const val = addTableOrder.handler();
        return val;
    });

exports.testing = fb.functions.https.onRequest((req, res) => {
    const val = testing.handler(req, res);
    return val;
});

exports.addGrocery = fb.functions.https.onCall((data, context) => {
    const val = addGrocery.handler(data, context);
    return val;
});