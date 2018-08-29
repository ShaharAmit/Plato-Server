import * as firebase from '../lib/firebase.js'
import { HttpsError } from 'firebase-functions/lib/providers/https';

const fb = new firebase();

exports.handler = async (data, context) => {

    const restId = data.restId;
    const tableId = data.tableId;

    return new Promise((resolve, reject) => {
        fb.db.collection(`/${fb.rest}/${restId}/TablesOrders/${tableId}/orders`).get().then(orders => {
            orders.forEach(order => {
                const status = order.data().status;
                if (status === 'active' || status === 'scheduled') {
                    throw new HttpsError("aborted", 'Table contains active orders');
                }
            })
            const batch = fb.db.batch();
            batch.delete(fb.db.doc(`/${fb.rest}/${restId}/Tables/${tableId}`));
            batch.commit().then(resolve).catch(reject);

        }).catch(reject);
    });
}