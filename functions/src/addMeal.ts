import * as firebase from '../lib/firebase.js'

const fb = new firebase();

exports.handler = (data, context) => {
    console.log('restId: ', data.restId);
    const mealDoc = fb.db.collection('RestAlfa' + '/' + data.restId + '/Meals/').doc(data.meal.name);
<<<<<<< HEAD
        //creating the batch below
        const batch = fb.db.batch();

        mealDoc.set(data.meal)
        .then(x => {
            console.log('add meal is working');
            data.dishes.forEach(dish => {
                //batch work below
                batch.set(fb.db.doc(mealDoc + 'dishes/' + dish),{
                    id: dish
=======
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
>>>>>>> a4e71cfd38a9ef70dfa232ff4e8ddbdbebdb2657
                });
            });

<<<<<<< HEAD
            Object.keys(data.rawMaterials).forEach(rawMaterial => {
                //batch work below
                batch.set(fb.db.doc(`/RestAlfa/${data.restId}/WarehouseStock/${rawMaterial}/Meals/${data.meal.name}`),
                    data.rawMaterials[rawMaterial]);
            });

            // batch acctual happen
            return batch.commit();
        });
=======
                batch.commit().then(resolve).catch(reject);
            })
            .catch(reject);
    });
>>>>>>> a4e71cfd38a9ef70dfa232ff4e8ddbdbebdb2657
};