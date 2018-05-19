"use strict";
//updateDishStatus.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase = require("../lib/firebase.js");
const fb = new firebase();
exports.handler = (change, context) => __awaiter(this, void 0, void 0, function* () {
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
                    if (materials[material]) {
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
                console.log();
                WarehouseStockCollection.doc(material).get().then(x => {
                    const data = x.data();
                    data.value.amount -= materials[material];
                    WarehouseStockCollection.doc(material).set(data).then(x => {
                        console.log("updated ", data);
                    }).catch(x => {
                        console.log("error when updating", x);
                    });
                    console.log(data);
                });
            });
        });
    }
    console.log("status is not 2");
});
//# sourceMappingURL=updateDishStatus.js.map