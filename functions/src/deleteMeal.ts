import * as firebase from '../lib/firebase.js'

const fb = new firebase();

exports.handler = async (data, context) => {
    const restId = data.restId;
    const mealName = data.mealName;

    return new Promise((resolve, reject) => {
        fb.db.collection(`/RestAlfa/${restId}/Meals/${mealName}/RawMaterials`).get().then(rawMaterials => {
            const batch = fb.db.batch();
            rawMaterials.docs.forEach(rawMaterial => {
                batch.delete(fb.db.doc(`/RestAlfa/${restId}/WarehouseStock/${rawMaterial.id}/Meals/${mealName}`));
            });
            batch.delete(fb.db.doc(`/RestAlfa/${restId}/Meals/${mealName}`));

            batch.commit().then(resolve).catch(reject);
        }).catch(reject);
    })
}