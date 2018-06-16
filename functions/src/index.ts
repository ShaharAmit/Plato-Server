const sendMessage = require('./shahar/customers/sendMessage'),
    registerToRest = require('./shahar/customers/registerToRest'),
    unRegisterToRest = require('./shahar/customers/unRegisterToRest'),
    deleteGlobWorkers = require('./shahar/customers/deleteGlobWorker'),
    createWorker = require('./shahar/customers/createWorker'),
    createGlobWorker = require('./shahar/customers/createGlobWorker'),

    amount = require('./shahar/meals/amount'),
    redLine = require('./shahar/meals/redLine'),
    missingChanged = require('./shahar/meals/missingChanged'),
    groceryBackToMenu = require('./shahar/meals/groceryBackToMenu'),

    //TODO: cron to tableOrdersPred
    collectTableOrders = require('./shahar/predictions/collectTableOrders'),
    collectTableOrdersHandler = require('./shahar/predictions/collectTableOrdersHandler'),
    mealOrdered = require('./shahar/predictions/mealOrdered'),
    addTableOrder = require('./shahar/predictions/addTableOrder'),
    predictNextWeekCustomers = require('./shahar/predictions/predictNextWeekCustomers'),

    //TODO: cron to utc check
    checkUTC = require('./shahar/rest/checkUTC'),

    addGrocery = require('./addGrocery'),
    deleteGrocery = require('./deleteGrocery'),
    updateGrocery = require('./updateGrocery'),
    addDish = require('./addDish'),
    addMeal = require('./addMeal'),
    addKitchenStation = require('./addKitchenStation'),
    testing = require('./testing'),
    updateDishStatus = require('./updateDishStatus'),
    getDishesForKitchen = require('./getDishesForKitchen'),
    addRest = require('./addRest'),
    setPossibleConnectionForTables = require('./setPossibleConnectionForTables'),
    unDisplayTables = require('./unDisplayTables'),
    disconnectMergedTables = require('./disconnectMergedTables'),
    addTable = require('./addTable'),
    mergeTables = require('./mergeTables'),
    validateTablesAreConnectable = require('./validateTablesAreConnectable'),
    updateTableLocation = require('./updateTableLocation'),
    mergeMovedTables = require('./mergeMovedTables');

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
    .document('{rest}/{restID}/TablesOrders/{tableID}/orders/{order}').onWrite((change, context) => {
        const val = addTableOrder.handler(change, context);
        return val;
    });

exports.mealOrdered = fb.functions.firestore
    .document('{rest}/{restID}/Orders/{orderID}/meals/{mealID}').onWrite((change, context) => {
        const val = mealOrdered.handler(change, context);
        return val;
    });

exports.predictNextWeekCustomers = fb.functions.firestore
    .document('{rest}/{restID}/YearlyActivity/{hour}/Days/{timestamp}').onUpdate((change, context) => {
        const val = predictNextWeekCustomers.handler(change, context);
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

exports.checkUTC = fb.functions.https.onRequest((req, res) => {
    const val = checkUTC.handler(req, res);
    return val;
});

exports.testing = fb.functions.https.onRequest((req, res) => {
    const val = testing.handler(req, res);
    return val;
});

exports.collectTableOrders = fb.functions.https.onRequest((req, res) => {
    const val = collectTableOrders.handler(req, res);
    return val;
});

exports.collectTableOrdersHandler = fb.functions.https.onRequest((req, res) => {
    const val = collectTableOrdersHandler.handler(req, res);
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

exports.getDishesForKitchen = fb.functions.https.onCall((data, context) => {
    const val = getDishesForKitchen.handler(data, context);
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

exports.addRest = fb.functions.https.onCall((data, context) => {
    const val = addRest.handler(data, context);
    return val;
});

exports.addTable = fb.functions.https.onCall((data, context) => {
    const val = addTable.handler(data, context);
    return val;
});

exports.setPossibleConnectionForTables = fb.functions.https.onCall((data, context) => {
    const val = setPossibleConnectionForTables.handler(data, context);
    return val;
});

exports.unDisplayTables = fb.functions.https.onCall((data, context) => {
    const val = unDisplayTables.handler(data, context);
    return val;
});

exports.disconnectMergedTables = fb.functions.https.onCall((data, context) => {
    const val = disconnectMergedTables.handler(data, context);
    return val;
});

exports.mergeTables = fb.functions.https.onCall((data, context) => {
    const val = mergeTables.handler(data, context);
    return val;
});

exports.validateTablesAreConnectable = fb.functions.https.onCall((data, context) => {
    const val = validateTablesAreConnectable.handler(data, context);
    return val;
});

exports.updateTableLocation = fb.functions.https.onCall((data, context) => {
    const val = updateTableLocation.handler(data, context);
    return val;
});

exports.mergeMovedTables = fb.functions.https.onCall((data, context) => {
    const val = mergeMovedTables.handler(data, context);
    return val;
});

