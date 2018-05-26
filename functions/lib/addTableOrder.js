"use strict";
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
    const restID = context.params.restID, orderID = context.params.order, rest = context.params.rest, data = change.data(), tableID = data.tableID, customerID = data.orderedBy, instantOrder = data.instantOrder, timeStamp = data.date, table = fb.bq.dataset('predictions').table('table_orders');
    fb.db.doc(rest + '/' + restID + '/Tables/' + tableID).get()
        .then(docData => {
        return docData.data().size;
    }).then(tableSize => {
        return {
            RestID: restID,
            InstantOrder: instantOrder,
            TableSize: tableSize,
            OrderID: orderID,
            CustomerID: customerID,
            TimeStamp: timeStamp
        };
    }).then(row => {
        table.insert(row)
            .then(() => {
            console.log(`Inserted ${row.length} rows`);
            return 0;
        })
            .catch(err => {
            if (err && err.name === 'PartialFailureError') {
                if (err.errors && err.errors.length > 0) {
                    console.log('Insert errors:');
                    err.errors.forEach(error => console.error(error));
                }
            }
            else {
                console.error('ERROR:', err);
            }
        });
    });
});
//# sourceMappingURL=addTableOrder.js.map