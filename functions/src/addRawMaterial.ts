import * as firebase from '../lib/firebase.js'

const fb = new firebase();

exports.handler = async (data, context) => {
    const batch = fb.db.batch();

    batch.set(fb.db.collection(`/${fb.rest}/${data.restId}/WarehouseStock`).doc(data.rawMaterial.name), {value: data.rawMaterial});

    return batch.commit();
};