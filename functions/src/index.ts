const sendMessage = require('./sendMessage');
const amount = require('./amount');
const redLine = require('./redLine');
const registerToRest = require('./registerToRest');
const missingChanged = require('./missingChanged');
const deleteUser = require('./deleteUser');
const createUser = require('./createUser');
const updateDishStatus = require('./updateDishStatus');

import * as firebase from '../lib/firebase.js'

const fb = new firebase();

exports.registerToRest = fb.functions.https.onRequest((req, res) => {
    const val = registerToRest.handler(req, res);
    return val;
});

exports.missingChanged = fb.functions.firestore
    .document('{rest}/{restID}/Meals/{mealName}')
    .onUpdate((change,context)=> {
        const val = missingChanged.handler(change,context);
        return val;
    })

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

exports.deleteUser = fb.functions.auth.user()
.onDelete((user) => {
    const val = deleteUser.handler(user);
    return val;
});

exports.createUser = fb.functions.auth.user()
.onCreate((user) => {
    const val = createUser.handler(user);
    return val;
});

// exports.updateDishStatus = fb.functions.https.onRequest((req, res) => {
//     const val = updateDishStatus.handler(req,res);
//     res.send("done");
// });

exports.updateDishStatus = fb.functions.firestore.document("/{rest}/{restId}/Orders/{orderId}/meals/{mealId}/dishes/{dishId}").onUpdate((change, context) => {
    const val = updateDishStatus.handler(change, context);
    return val;
});