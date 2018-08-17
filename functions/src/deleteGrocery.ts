import * as firebase from '../lib/firebase.js'
import { HttpsError } from 'firebase-functions/lib/providers/https';

const fb = new firebase();

function checkIfDishesContainsGrocery(restId: string, groceryName: string): Promise<{ contains: boolean, containgDish: string }> {
    return new Promise<{ contains: boolean, containgDish: string }>((resolve, reject) => {
        fb.db.collection(`/RestAlfa/${restId}/Dishes`).get().then(dishes => {
            const totalDishes = dishes.docs.length;
            let checkedDishes = 0;
            if (totalDishes === 0) {
                resolve({ contains: false, containgDish: undefined });
            }

            dishes.docs.forEach(dish => {
                fb.db.collection(`/RestAlfa/${restId}/Dishes/${dish.id}/grocery`).where("id", "==", groceryName)
                    .get().then(groceries => {
                        if (groceries.docs.length > 0) {
                            resolve({ contains: true, containgDish: dish.id });
                            return;
                        }

                        checkedDishes++;
                        if (checkedDishes === totalDishes) {
                            resolve({ contains: false, containgDish: undefined });
                            return;
                        }
                    }).catch(reject);
            })

        }).catch(reject);
    });
}

exports.handler = async (data, context) => {
    console.log('restId: ', data.restId);

    return new Promise((resolve, reject) => {

        checkIfDishesContainsGrocery(data.restId, data.grocery.name).then(x => {
            if (x.contains) {
                reject(new HttpsError('aborted', `Grocery is contained in other dish(${x.containgDish})`));
                return;
            }

            const batch = fb.db.batch();
            batch.delete(fb.db.collection('RestAlfa' + '/' + data.restId + '/Grocery/').doc(data.grocery.name));
            batch.commit().then(resolve).catch(reject);
        }).catch(reject);
    });

};