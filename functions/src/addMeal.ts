import * as firebase from '../lib/firebase.js'

const fb = new firebase();

exports.handler = async (data, context) => {
    console.log('restId: ', data.restId);
    const mealDoc = fb.db.collection('RestAlfa' + '/' + data.restId + '/Meals/').doc(data.meal.name);
    return new Promise((resolve, reject) => {
        mealDoc.set(data.meal)
            .then(x => {
                console.log('add meal is working');
                data.dishes.forEach(dish => {
                    mealDoc.collection('dishes').doc(dish).set({id: dish})
                        .then(result => console.log('dish added to meal', dish))
                        .catch(reject);
                });

                Object.keys(data.rawMaterials).forEach(rawMaterial => {
                    fb.db.doc(`/RestAlfa/${data.restId}/WarehouseStock/${rawMaterial}/Meals/${data.meal.name}`)
                        .set(data.rawMaterials[rawMaterial])
                        .catch(reject);
                });

                resolve();
            })
            .catch(reject);
    });

};