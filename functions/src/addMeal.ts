import * as firebase from '../lib/firebase.js'

const fb = new firebase();

exports.handler = (data, context) => {
    console.log('restId: ', data.restId);
    const mealDoc = fb.db.collection('Rests' + '/' + data.restId + '/Meals/').doc(data.meal.name);
        //creating the batch below
        const batch = fb.db.batch();

        mealDoc.set(data.meal)
        .then(x => {
            console.log('add meal is working');
            data.dishes.forEach(dish => {
                //batch work below
                batch.set(fb.db.doc(mealDoc + 'dishes/' + dish),{
                    id: dish
                });
            });

            Object.keys(data.rawMaterials).forEach(rawMaterial => {
                //batch work below
                batch.set(fb.db.doc(`/Rests/${data.restId}/WarehouseStock/${rawMaterial}/Meals/${data.meal.name}`),
                    data.rawMaterials[rawMaterial]);
            });

            // batch acctual happen
            return batch.commit();
        });
};