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
    deleteGrocery = require('./deleteGrocery'),
    updateGrocery = require('./updateGrocery'),
    addDish = require('./addDish'),
    addMeal = require('./addMeal'),
    addKitchenStation = require('./addKitchenStation'),
    testing = require('./testing'),
    dishOrdered = require('./dishOrdered'),
    groceryBackToMenu = require('./groceryBackToMenu'),
    updateDishStatus = require('./updateDishStatus');

import * as firebase from '../lib/firebase.js'

const fb = new firebase();

exports.registerToRest = fb.functions.firestore
    .document('{rest}/{restID}/Workers/{uid}')
    .onCreate((change, context) => {
        const val = registerToRest.handler(change, context);
        return val;
    });

exports.unRegisterToRest = fb.functions.firestore
    .document('{rest}/{restID}/Workers/{uid}')
    .onDelete((change, context) => {
        const val = unRegisterToRest.handler(change, context);
        return val;
    });

exports.missingChanged = fb.functions.firestore
    .document('{rest}/{restID}/Meals/{mealName}')
    .onUpdate((change, context) => {
        const val = missingChanged.handler(change, context);
        return val;
    });

exports.sendMessage = fb.functions.firestore
    .document('{rest}/{restID}/Messages/{messageID}')
    .onCreate((change, context) => {
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
    .onDelete((change, context) => {
        const val = deleteGlobWorkers.handler(change, context);
        return val;
    });

exports.createGlobWorker = fb.functions.firestore
    .document('{rest}/{restID}/Workers/{uid}')
    .onCreate((change, context) => {
        const val = createGlobWorker.handler(change, context);
        return val;
    });

exports.addTableOrder = fb.functions.firestore
    .document('{rest}/{restID}/TablesOrders/{tableID}/orders/{order}').onCreate((change, context) => {
        const val = addTableOrder.handler(change, context);
        return val;
    });

exports.dishOrdered = fb.functions.firestore
    .document('{rest}/{restID}/Orders/{orderID}/meals/{mealID}/dishes/{dish}').onWrite((change, context) => {
        const val = dishOrdered.handler(change, context);
        return val;
    });

exports.groceryBackToMenu = fb.functions.firestore
    .document('{rest}/{restID}/Meals/{mealID}').onUpdate((change, context) => {
        const val = groceryBackToMenu.handler(change, context);
        return val;
    });

exports.updateDishStatus = fb.functions.firestore.document("/{rest}/{restId}/Orders/{orderId}/meals/{mealId}/dishes/{dishId}").onUpdate((change, context) => {
    const val = updateDishStatus.handler(change, context);
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

exports.deleteGrocery = fb.functions.https.onCall((data, context) => {
    const val = deleteGrocery.handler(data, context);
    return val;
});

exports.updateGrocery = fb.functions.https.onCall((data, context) => {
    const val = updateGrocery.handler(data, context);
    return val;
});

exports.addDish = fb.functions.https.onCall((data, context) => {
    const val = addDish.handler(data, context);
    return val;
});

exports.addMeal = fb.functions.https.onCall((data, context) => {
    const val = addMeal.handler(data, context);
    return val;
});

exports.addKitchenStation = fb.functions.https.onCall((data, context) => {
    const val = addKitchenStation.handler(data, context);
    return val;
});

exports.createWorker = fb.functions.https.onCall((data, context) => {
    const val = createWorker.handler(data, context);
    return val;
});
