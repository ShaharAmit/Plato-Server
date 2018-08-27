const sendMessage = require('./shahar/customers/sendMessage'),
    registerToRest = require('./shahar/customers/registerToRest'),
    unRegisterToRest = require('./shahar/customers/unRegisterToRest'),
    deleteGlobWorkers = require('./shahar/customers/deleteGlobWorker'),
    // createWorker = require('./shahar/customers/createWorker'),
    createGlobWorker = require('./shahar/customers/createGlobWorker'),

    amount = require('./shahar/meals/amount'),
    redLine = require('./shahar/meals/redLine'),
    missingChanged = require('./shahar/meals/missingChanged'),
    groceryBackToMenu = require('./shahar/meals/groceryBackToMenu'),

    collectTableOrders = require('./shahar/predictions/collectTableOrders'),
    predictionHandler = require('./shahar/predictions/predictionHandler'),
    checkStockHandler = require('./shahar/predictions/checkStockHandler'),
    mealOrdered = require('./shahar/predictions/mealOrdered'),
    addTableOrder = require('./shahar/predictions/addTableOrder'),
    predictNextWeekCustomers = require('./shahar/predictions/predictNextWeekCustomers'),
    collectRawMat = require('./shahar/predictions/collectRawMat'),
    predictNextWeekRawMat = require('./shahar/predictions/predictNextWeekRawMat'),
    checkStockPrediction = require('./shahar/predictions/checkStockPrediction'),
    smallChecksHandler = require('./shahar/predictions/smallChecksHandler'),
    collectRecommendations = require('./shahar/predictions/collectRecommendations'),
    onceInAMonthHandler = require('./shahar/predictions/onceInAMonthHandler'),
    gatherRanking = require('./shahar/predictions/gatherRanking'),

    checkRanks = require('./shahar/ranks/checkRanks'),

    checkUTC = require('./shahar/rest/checkUTC'),

    countOrders = require('./shahar/count/countOrders'),
    countCustomers = require('./shahar/count/countCustomers'),
    countMostPopular = require('./shahar/count/countMostPopular'),

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
    disconnectMergedTables = require('./disconnectMergedTables'),
    addTable = require('./addTable'),
    mergeTables = require('./mergeTables'),
    validateTablesAreConnectable = require('./validateTablesAreConnectable'),
    updateTableLocation = require('./updateTableLocation'),
    mergeMovedTables = require('./mergeMovedTables'),
    createStaticObject = require('./createStaticObject'),
    addRawMaterial = require('./addRawMaterial'),
    deleteRawMaterial = require('./deleteRawMaterial'),
    createWorker = require('./createWorker'),
    updateWorker = require('./updateWorker'),
    deleteWorker = require('./deleteWorker'),
    deleteDish = require('./deleteDish'),
    updateDish = require('./updateDish'),
    deleteMeal = require('./deleteMeal'),
    updateMeal = require('./updateMeal'),
    deleteDishFromMeal = require('./deleteDishFromMeal'),
    deleteGroceryFromDish = require('./deleteGroceryFromDish'),
    deleteKitchenStation = require('./deleteKitchenStation'),
    preCheckForDeletingRawMaterial = require('./preCheckForDeletingRawMaterial');

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

exports.checkRanks = fb.functions.firestore
    .document('{rest}/{restID}/MealsRanking/{Meal}/{rank}/{newRank}')
    .onCreate((change, context) => {
        const val = checkRanks.handler(change, context);
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

exports.predictNextWeekRawMat = fb.functions.firestore
    .document('{rest}/{restID}/YearlyUse/{hour}/Days/{timestamp}').onUpdate((change, context) => {
        const val = predictNextWeekRawMat.handler(change, context);
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

exports.checkStockPrediction = fb.functions.https.onRequest((req, res) => {
    const val = checkStockPrediction.handler(req, res);
    return val;
});

exports.testing = fb.functions.https.onRequest((req, res) => {
    const val = testing.handler(req, res);
    return val;
});

exports.collectRawMat = fb.functions.https.onRequest((req, res) => {
    const val = collectRawMat.handler(req, res);
    return val;
});

exports.gatherRanking = fb.functions.https.onRequest((req, res) => {
    const val = gatherRanking.handler(req, res);
    return val;
});

exports.collectRecommendations = fb.functions.https.onRequest((req, res) => {
    const val = collectRecommendations.handler(req, res);
    return val;
});

exports.collectTableOrders = fb.functions.https.onRequest((req, res) => {
    const val = collectTableOrders.handler(req, res);
    return val;
});

exports.predictionHandler = fb.functions.https.onRequest((req, res) => {
    const val = predictionHandler.handler(req, res);
    return val;
});

exports.countOrders = fb.functions.https.onRequest((req, res) => {
    const val = countOrders.handler(req, res);
    return val;
});

exports.countCustomers = fb.functions.https.onRequest((req, res) => {
    const val = countCustomers.handler(req, res);
    return val;
});

exports.countMostPopular = fb.functions.https.onRequest((req, res) => {
    const val = countMostPopular.handler(req, res);
    return val;
});

exports.checkStockHandler = fb.functions.https.onRequest((req, res) => {
    const val = checkStockHandler.handler(req, res);
    return val;
});

exports.onceInAMonthHandler = fb.functions.https.onRequest((req, res) => {
    const val = onceInAMonthHandler.handler(req, res);
    return val;
});

exports.smallChecksHandler = fb.functions.https.onRequest((req, res) => {
    const val = smallChecksHandler.handler(req, res);
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

// exports.createWorker = fb.functions.https.onCall((data, context) => {
//     const val = createWorker.handler(data, context);
//     return val;
// });

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

exports.createStaticObject = fb.functions.https.onCall((data, context) => {
    const val = createStaticObject.handler(data, context);
    return val;
});

exports.addRawMaterial = fb.functions.https.onCall((data, context) => {
    const val = addRawMaterial.handler(data, context);
    return val;
});

exports.preCheckForDeletingRawMaterial = fb.functions.https.onCall((data, context) => {
    const val = preCheckForDeletingRawMaterial.handler(data, context);
    return val;
});

exports.deleteRawMaterial = fb.functions.https.onCall((data, context) => {
    const val = deleteRawMaterial.handler(data, context);
    return val;
});

exports.createWorker = fb.functions.https.onCall((data, context) => {
    const val = createWorker.handler(data, context);
    return val;
});

exports.updateWorker = fb.functions.https.onCall((data, context) => {
    const val = updateWorker.handler(data, context);
    return val;
});

exports.deleteWorker = fb.functions.https.onCall((data, context) => {
    const val = deleteWorker.handler(data, context);
    return val;
});

exports.deleteDish = fb.functions.https.onCall((data, context) => {
    const val = deleteDish.handler(data, context);
    return val;
});

exports.updateDish = fb.functions.https.onCall((data, context) => {
    const val = updateDish.handler(data, context);
    return val;
});

exports.deleteGroceryFromDish = fb.functions.https.onCall((data, context) => {
    const val = deleteGroceryFromDish.handler(data, context);
    return val;
});

exports.deleteMeal = fb.functions.https.onCall((data, context) => {
    const val = deleteMeal.handler(data, context);
    return val;
});

exports.updateMeal = fb.functions.https.onCall((data, context) => {
    const val = updateMeal.handler(data, context);
    return val;
});

exports.deleteDishFromMeal = fb.functions.https.onCall((data, context) => {
    const val = deleteDishFromMeal.handler(data, context);
    return val;
});

exports.deleteKitchenStation = fb.functions.https.onCall((data, context) => {
    const val = deleteKitchenStation.handler(data, context);
    return val;
});