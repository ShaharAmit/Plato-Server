import * as firebase from '../lib/firebase.js'

const fb = new firebase();

exports.handler = async (data, context) => {
    console.log('restId: ', data.restId);
    const mealDoc = fb.db.collection('RestAlfa' + '/' + data.restId + '/Meals/').doc(data.meal.name);
    const batch = fb.db.batch();

    return new Promise((resolve, reject) => {

        mealDoc.set(data.meal)
            .then(x => {
                console.log('add meal is working');
                data.dishes.forEach(dish => {
                    batch.set(mealDoc.collection('dishes').doc(dish), {id: dish})
                });

                Object.keys(data.rawMaterials).forEach(rawMaterial => {
                    batch.set(fb.db.doc(`/RestAlfa/${data.restId}/WarehouseStock/${rawMaterial}/Meals/${data.meal.name}`)
                        , data.rawMaterials[rawMaterial])
                });

                batch.commit().then(resolve).catch(reject);
            })
            .catch(reject);
    });
};