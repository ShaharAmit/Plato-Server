"use strict";
exports.__esModule = true;
var sendMessage = require('./sendMessage');
var amount = require('./amount');
var redLine = require('./redLine');
var registerToRest = require('./registerToRest');
var missingChanged = require('./missingChanged');
var deleteUser = require('./deleteUser');
var createUser = require('./createUser');
var updateDishStatus = require('./updateDishStatus');
var firebase = require("../lib/firebase.js");
var fb = new firebase();
exports.registerToRest = fb.functions.https.onRequest(function (req, res) {
    var val = registerToRest.handler(req, res);
    return val;
});
exports.missingChanged = fb.functions.firestore
    .document('{rest}/{restID}/Meals/{mealName}')
    .onUpdate(function (change, context) {
    var val = missingChanged.handler(change, context);
    return val;
});
exports.sendMessage = fb.functions.firestore
    .document('{rest}/{restID}/Messages/{messageID}')
    .onCreate(function (change, context) {
    var val = sendMessage.handler(change, context);
    return val;
});
exports.amount = fb.functions.firestore
    .document('{rest}/{restID}/WarehouseStock/{rawMaterial}').onUpdate(function (change, context) {
    var val = amount.handler(change, context);
    return val;
});
exports.redLine = fb.functions.firestore
    .document('{rest}/{restID}/WarehouseStock/{rawMaterial}/Meals/{meal}').onCreate(function (change, context) {
    var val = redLine.handler(change, context);
    return val;
});
exports.deleteUser = fb.functions.auth.user()
    .onDelete(function (user) {
    var val = deleteUser.handler(user);
    return val;
});
exports.createUser = fb.functions.auth.user()
    .onCreate(function (user) {
    var val = createUser.handler(user);
    return val;
});
exports.updateDishStatus = fb.functions.https.onRequest((req, res) => {
    const val = updateDishStatus.handler(req,res);
    res.send("done");
});
// exports.updateDishStatus = fb.functions.database.ref("/RestAlfa/{restId}/Orders/{orderId}/meals/{mealId}/dishes/{dishId}", function (event) {
//     console.log("update triggered");
// });
