import * as firebase from '../lib/firebase.js'

const fb = new firebase();

class PreCheckResult {
    mealsAboutToDelete: string[];

    constructor(mealsAboutToDelete: string[]) {
        this.mealsAboutToDelete = mealsAboutToDelete;
    }
}

exports.PreCheckResult = PreCheckResult;

exports.handler = async (data, context) => {
    const rawMaterialDoc = fb.db.collection(`/${fb.rest}/${data.restId}/WarehouseStock`).doc(data.name);
    return new Promise((resolve, reject) => {
        rawMaterialDoc.collection('Meals').where('isImportant', '==', true).get()
            .then(mealsSnapshot => {
                console.log('meals', mealsSnapshot.docs);
                resolve(new PreCheckResult(mealsSnapshot.docs.map(x => x.id)));
            }).catch(reject);
    });
};