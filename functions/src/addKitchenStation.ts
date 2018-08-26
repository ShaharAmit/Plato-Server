import * as firebase from '../lib/firebase.js'

const fb = new firebase();

exports.handler = async (data, context) => {

    const batch = fb.db.batch();
    const kitchenStation = data.kitchenStation;

    batch.set(fb.db.collection(`/RestAlfa/${data.restId}/KitchenStation`).doc(kitchenStation.id), kitchenStation);

    return batch.commit();
};