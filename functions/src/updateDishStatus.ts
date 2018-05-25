
//updateDishStatus.ts

import * as firebase from '../lib/firebase.js'
const fb = new firebase();

exports.handler = async (change, context) => {
    const rest = context.params.rest;
    const restID = context.params.restId;
    const orderId = context.params.orderId;
    const mealId = context.params.mealId;
    const dishId = context.params.dishId;

    const newValue = change.after.data();
    console.log("entered");
    if (newValue.status === 2) {
        console.log("status is 2");
        const path = `/${rest}/${restID}/Orders/${orderId}/meals/${mealId}/dishes/${dishId}/groceries`;
        console.log("path: " + path);
        fb.db.collection(path).get().then(docs => {
            const materials = {};
            docs.forEach(doc => {
                const data = doc.data();
                Object.keys(data.rawMaterial).forEach(material => {
                    if(materials[material]) {
                        materials[material] += data.rawMaterial[material];
                    }
                    else {
                        materials[material] = data.rawMaterial[material];
                    }
                });
            });
            console.log(materials);
            const WarehouseStockCollection = fb.db.collection(`/${rest}/${restID}/WarehouseStock/`);
            Object.keys(materials).forEach(material => {
                console.log()
                WarehouseStockCollection.doc(material).get().then(x => {
                    const data = x.data();
                    data.value.amount -= materials[material];
                    WarehouseStockCollection.doc(material).set(data).then(x => {
                        console.log("updated ", data);
                    }).catch(x => {
                        console.log("error when updating", x);
                    });
                    console.log(data);
                })
            });
        });
    }
    console.log("status is not 2");
};