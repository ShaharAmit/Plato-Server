import * as firebase from '../lib/firebase.js'

const fb = new firebase();

exports.handler = (data, context) => {
    console.log('restId: ', data.restId);
    console.log('data', data);
    const mealDoc = fb.db.collection(fb.rest + '/' + data.restId + '/Meals/').doc(data.meal.name);
    //creating the batch below
    const batch = fb.db.batch();

    batch.set(mealDoc, data.meal);
    data.dishes.forEach(dish => {
        //batch work below
        batch.set(mealDoc.collection('dishes').doc(dish), {
            id: dish
        });
    });

    Object.keys(data.rawMaterials).forEach(rawMaterial => {
        //batch work below
        batch.set(fb.db.doc(`/${fb.rest}/${data.restId}/WarehouseStock/${rawMaterial}/Meals/${data.meal.name}`),
            data.rawMaterials[rawMaterial]);
        batch.set(fb.db.doc(`/${fb.rest}/${data.restId}/Meals/${data.meal.name}/RawMaterials/${rawMaterial}`), { id: rawMaterial });
    });

    // batch acctual happen
    return batch.commit();
};